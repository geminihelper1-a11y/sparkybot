# Spark NETHRION v9.0 — All-in-one bot suite

This build keeps the existing Spark systems and adds a broad, practical Discord-bot toolkit behind Spark's natural-language tool layer.

## Added / expanded

### Community
- AFK set/clear/check + automatic mention notices
- Persistent reminders + automatic delivery
- Polls with timed close/results
- Timed giveaways with reaction entries
- Welcome and goodbye messages
- Auto-role, delayed auto-role, sticky roles
- XP/levels + leaderboard
- Starboard
- Highlights / keyword notifications
- Repeating scheduled messages
- Self-role dropdown menus

### Server management
- Slowmode
- Channel topics and renaming
- Invite creation
- Nickname management
- Custom commands
- Tags
- Autoresponders
- Announcement embeds
- Log-channel routing
- Configurable automod toggles
- Scheduled auto-purge
- Forms-style announcement panels
- Existing tickets, suggestions, backups, roles, channels, threads, events, moderation and SMP tools remain available

### Live knowledge / operations
- Discord is still the live source of truth
- Message history/search, member history, audit logs, server structure, roles, channels, voice activity, SMP status and stored Spark memory remain tool accessible
- Natural-language actions use real Discord entities and permission checks

### Important platform boundary
"No limit" here means Spark is not deliberately crippled with a small bot-style command set. Discord's own API, permission model, hierarchy, rate limits, message retention/access rules and external-service requirements still apply.

Music streaming, social-platform feeds and other external integrations are deliberately not faked: those require their respective service APIs/credentials or an audio backend. The architecture leaves room for adding those providers without changing Spark's conversation layer.
