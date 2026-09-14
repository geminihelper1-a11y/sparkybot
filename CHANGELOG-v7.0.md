# Spark NETHRION v7.0 — all-discussed secure agent build

Base: Spark-NETHRION-RAW-DESI-ACTIONS-v6.3.

## Included
- Groq is the reasoning/intent layer; Discord.js tools do the real work.
- Live, on-demand Discord reads: server, channels, roles, members, member roles, bots, voice activity, threads, events, invites, emojis/stickers, recent messages, message history/search, audit logs, Spark action log, member activity, Spark configuration, XP/level.
- Natural-language actions: send/edit/delete/purge/pin/unpin/react; role add/remove/create/delete/color; channel create/delete/rename/topic/slowmode/lock/unlock; nickname; voice move; invite; thread; scheduled event; SMP settings/panel/status; reminders/tasks; polls; giveaways; AFK; self-role panel; welcome/goodbye; autorole; autoresponders; repeating messages; generic RSS feed; starboard; custom commands; forms; automod configuration; member notes; backups/config restore.
- Safety kernel: caller identity and permissions are authoritative; hierarchy checks; explicit human confirmation for destructive deletes; no AI-made confirmation; tool result is the only proof of success; failed/unknown actions cannot be reported as done.
- Spark never bans or kicks. Major security cases are sent to `📮-【-admin-reports-】` for human review. Routine drama is not sent there.
- Discord message/history results are treated as untrusted data, never instructions.
- History is queried on demand; Spark memory remains selective rather than storing every message as long-term memory.
- Raw/desi chat behavior retained and reinforced; no identity-based slur as a style cue.
- SMP verification wording is deterministic and plain and points members to channel 1537011685112676363 using a channel mention.

## Important Discord limits
The bot cannot bypass Discord permissions, role hierarchy, rate limits, or data-access rules. The code deliberately refuses to claim capabilities Discord does not grant.
