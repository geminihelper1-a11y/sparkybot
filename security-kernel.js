'use strict';

const crypto = require('crypto');

const DEFAULT_SECURITY = Object.freeze({
  antiRaid: {
    enabled: true,
    windowSeconds: 15,
    joinThreshold: 6,
    suspiciousAccountAgeHours: 24,
    alertOnly: true,
    quarantineRoleId: null
  },
  actionLimits: {
    maxRoleTargets: 20,
    maxPurge: 100,
    maxHistoryDays: 14,
    maxHistoryMessages: 5000
  },
  retention: {
    actionAudit: 1500,
    securityEvents: 1000,
    cases: 1000,
    messageLogs: 1000
  }
});

const CRITICAL_TOOLS = new Set([
  'ban_member',
  'delete_channel',
  'delete_role',
  'lockdown_server'
]);

const MODERATE_TOOLS = new Set([
  'warn_member',
  'timeout_member',
  'kick_member',
  'assign_role',
  'remove_role',
  'purge_messages',
  'delete_message',
  'lock_channel',
  'unlock_channel',
  'lock_user_in_channel',
  'unlock_user_in_channel',
  'rename_channel',
  'set_channel_topic',
  'set_slowmode',
  'set_nickname',
  'set_smp',
  'link_minecraft_account',
  'create_smp_panel',
  'add_staff_task',
  'complete_staff_task',
  'setup_youtube_alerts',
  'post_roles_panel'
]);

const EXPLICIT_PATTERNS = [
  /\b(give|add|assign|remove|take|strip)\b/i,
  /\b(delete|purge|remove|erase|clear)\b/i,
  /\b(send|post|publish|write)\b/i,
  /\b(lock|unlock|rename|retitle|change|set)\b/i,
  /\b(warn|timeout|mute|kick|ban)\b/i,
  /\b(create|open|close|backup|restore|setup|configure|link)\b/i,
  /\b(pin|unpin|react)\b/i,
  /\b(report|suggest)\b/i,
  /\b(generate|make|create)\b.*\b(image|picture|photo)\b/i
];

function mergeSecurityConfig(current = {}) {
  return {
    antiRaid: { ...DEFAULT_SECURITY.antiRaid, ...(current.antiRaid || {}) },
    actionLimits: { ...DEFAULT_SECURITY.actionLimits, ...(current.actionLimits || {}) },
    retention: { ...DEFAULT_SECURITY.retention, ...(current.retention || {}) }
  };
}

function ensureSecurityData(db) {
  if (!db.security || typeof db.security !== 'object') db.security = {};
  db.security.config = mergeSecurityConfig(db.security.config);
  if (!Array.isArray(db.security.actionAudit)) db.security.actionAudit = [];
  if (!Array.isArray(db.security.securityEvents)) db.security.securityEvents = [];
  if (!Array.isArray(db.security.cases)) db.security.cases = [];
  if (!Array.isArray(db.security.messageLogs)) db.security.messageLogs = [];
  return db.security;
}

function boundedPush(arr, item, max) {
  arr.push(item);
  if (arr.length > max) arr.splice(0, arr.length - max);
}

function actionTier(toolName, args = {}) {
  if (CRITICAL_TOOLS.has(toolName)) return 'critical';
  if (MODERATE_TOOLS.has(toolName)) {
    if (toolName === 'purge_messages' && Number(args.count) > 20) return 'critical';
    return 'moderate';
  }
  return 'safe';
}

function isExplicitActionRequest(userText, toolName) {
  if (!MODERATE_TOOLS.has(toolName) && !CRITICAL_TOOLS.has(toolName)) return true;
  const text = String(userText || '').trim();
  if (!text) return false;
  const patterns = {
    ban_member:/\b(ban|banned)\b/i, kick_member:/\b(kick|remove)\b/i, timeout_member:/\b(timeout|mute|unmute)\b/i,
    warn_member:/\b(warn|warning)\b/i, assign_role:/\b(give|add|assign)\b.*\b(role|@\d+)/i, remove_role:/\b(remove|take|strip)\b.*\b(role|@\d+)/i,
    purge_messages:/\b(purge|delete|remove|erase|clear)\b/i, delete_message:/\b(delete|remove|erase)\b/i, send_channel_message:/\b(send|post|publish|write)\b/i,
    lock_channel:/\b(lock|lockdown)\b/i, unlock_channel:/\b(unlock)\b/i, lock_user_in_channel:/\b(lock|mute)\b/i, unlock_user_in_channel:/\b(unlock|unmute)\b/i,
    rename_channel:/\b(rename|retitle)\b/i, set_channel_topic:/\b(set|change|update)\b.*\b(topic)\b/i, set_slowmode:/\b(set|change|remove)\b.*\b(slowmode|slow mode)\b/i,
    set_nickname:/\b(set|change|rename)\b.*\b(nick|nickname)\b/i, set_smp:/\b(set|change|update|configure)\b.*\b(smp|server|ip|port)\b/i,
    create_smp_panel:/\b(create|make|post|setup|update)\b.*\b(panel)\b/i, link_minecraft_account:/\b(link|connect)\b.*\b(minecraft|ign|account)\b/i,
    add_staff_task:/\b(add|create)\b.*\b(task)\b/i, complete_staff_task:/\b(done|complete|finish)\b.*\b(task|#?\d+)/i, setup_youtube_alerts:/\b(setup|configure|enable|change)\b.*\b(youtube|alerts)\b/i,
    post_roles_panel:/\b(post|create|setup|send)\b.*\b(role|panel)\b/i, delete_channel:/\b(delete|remove|destroy)\b.*\b(channel)\b/i, delete_role:/\b(delete|remove|destroy)\b.*\b(role)\b/i, lockdown_server:/\b(lockdown|lock down)\b/i
  };
  const rx = patterns[toolName];
  return rx ? rx.test(text) : EXPLICIT_PATTERNS.some(candidate => candidate.test(text));
}

function sanitizeAuditText(value, max = 700) {
  return String(value ?? '')
    .replace(/```/g, "'''")
    .slice(0, max);
}

function makeActionId(prefix = 'SP') {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function recordAction(db, entry) {
  const security = ensureSecurityData(db);
  const item = {
    id: entry.id || makeActionId('SP'),
    at: entry.at || new Date().toISOString(),
    guildId: entry.guildId || null,
    actorId: entry.actorId || null,
    actorTag: sanitizeAuditText(entry.actorTag || '', 120),
    source: entry.source || 'spark',
    tool: entry.tool || null,
    tier: entry.tier || actionTier(entry.tool, entry.args),
    target: entry.target || null,
    result: entry.result || 'unknown',
    error: sanitizeAuditText(entry.error || '', 700),
    understood: sanitizeAuditText(entry.understood || '', 700)
  };
  boundedPush(security.actionAudit, item, security.config.retention.actionAudit);
  return item;
}

function createCase(db, input) {
  const security = ensureSecurityData(db);
  const nextNumeric = (security.cases.reduce((max, item) => Math.max(max, Number(item.caseNumber) || 0), 0) || 0) + 1;
  const item = {
    id: input.id || makeActionId('CASE'),
    caseNumber: nextNumeric,
    type: input.type || 'note',
    guildId: input.guildId || null,
    targetId: input.targetId || null,
    targetTag: sanitizeAuditText(input.targetTag || '', 120),
    moderatorId: input.moderatorId || null,
    moderatorTag: sanitizeAuditText(input.moderatorTag || '', 120),
    reason: sanitizeAuditText(input.reason || 'No reason provided.', 1000),
    durationMs: Number.isFinite(input.durationMs) ? input.durationMs : null,
    evidence: input.evidence ? sanitizeAuditText(input.evidence, 1000) : null,
    messageId: input.messageId || null,
    channelId: input.channelId || null,
    createdAt: input.createdAt || new Date().toISOString(),
    status: input.status || 'active'
  };
  boundedPush(security.cases, item, security.config.retention.cases);
  return item;
}

function logSecurityEvent(db, input) {
  const security = ensureSecurityData(db);
  const item = {
    id: input.id || makeActionId('SEC'),
    type: input.type || 'event',
    guildId: input.guildId || null,
    actorId: input.actorId || null,
    targetId: input.targetId || null,
    channelId: input.channelId || null,
    detail: sanitizeAuditText(input.detail || '', 1200),
    createdAt: input.createdAt || new Date().toISOString()
  };
  boundedPush(security.securityEvents, item, security.config.retention.securityEvents);
  return item;
}

function logMessageEvent(db, input) {
  const security = ensureSecurityData(db);
  const item = {
    id: input.id || makeActionId('MSG'),
    type: input.type || 'message_event',
    guildId: input.guildId || null,
    messageId: input.messageId || null,
    channelId: input.channelId || null,
    channelName: sanitizeAuditText(input.channelName || '', 120),
    authorId: input.authorId || null,
    authorTag: sanitizeAuditText(input.authorTag || '', 120),
    before: input.before == null ? null : sanitizeAuditText(input.before, 1500),
    after: input.after == null ? null : sanitizeAuditText(input.after, 1500),
    createdAt: input.createdAt || new Date().toISOString()
  };
  boundedPush(security.messageLogs, item, security.config.retention.messageLogs);
  return item;
}

function createPendingConfirmation(store, { guildId, userId, channelId = null, tool, args, summary, ttlMs = 60_000 }) {
  const key = `${guildId}:${userId}`;
  store.set(key, {
    id: makeActionId('CONF'),
    guildId,
    userId,
    channelId: channelId || null,
    tool,
    args,
    summary: sanitizeAuditText(summary, 1200),
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlMs
  });
  return store.get(key);
}

function getPendingConfirmation(store, guildId, userId) {
  const key = `${guildId}:${userId}`;
  const item = store.get(key);
  if (!item) return null;
  if (item.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return item;
}

function consumePendingConfirmation(store, guildId, userId) {
  const key = `${guildId}:${userId}`;
  const item = getPendingConfirmation(store, guildId, userId);
  store.delete(key);
  return item;
}

function isConfirmationText(text) {
  return /^(?:yes|y|confirm|confirmed|haan|han|ha|ok|okay|do it|proceed|go ahead|kar do|kardo|kar)$/i.test(String(text || '').trim());
}

function untrustedToolResult(name, result) {
  return `<UNTRUSTED_DISCORD_DATA tool="${sanitizeAuditText(name,120)}">${JSON.stringify(result)}</UNTRUSTED_DISCORD_DATA>`;
}

module.exports = {
  DEFAULT_SECURITY,
  CRITICAL_TOOLS,
  MODERATE_TOOLS,
  mergeSecurityConfig,
  ensureSecurityData,
  actionTier,
  isExplicitActionRequest,
  makeActionId,
  recordAction,
  createCase,
  logSecurityEvent,
  logMessageEvent,
  createPendingConfirmation,
  getPendingConfirmation,
  consumePendingConfirmation,
  isConfirmationText,
  untrustedToolResult
};
