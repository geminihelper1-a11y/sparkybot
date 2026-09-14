# Spark v10 — NETHRION all-in-one

Built from the uploaded Spark-NETHRION-RAW-DESI-CONSCIOUS-v6.2 base.

The goal is one bot covering the useful work normally split across moderation, logging, role-management, community and utility bots, while keeping natural-language control through Groq tool calling.

## Core areas

- Live Discord data: members, roles, channels, server info, VC activity, threads, scheduled events, invites, bans, emojis, audit log.
- On-demand history: search actual Discord message history by member, channel, keyword and date window; bad-word checks do not require pre-indexing every message.
- Moderation: warn, timeout, kick, ban, unban, purge, locks, nicknames, reports.
- Message ops: send, edit, delete, pin/unpin, react, slowmode, topic.
- Server ops: create/delete channels and roles, invites, SMP config/panel, backups.
- Community: AFK, reminders, polls, giveaways, suggestions, tickets, welcome/goodbye, autorole, leveling, starboard.
- Automation: AutoMod toggles, log channel, autoresponders, custom commands, repeating messages, YouTube alerts.
- AI: Groq chat/reasoning/tool orchestration; Gemini image generation only.

## Important behavior

History is retrieved on demand from Discord instead of being pushed into the AI context continuously. Spark's conversational memory remains separate from message-history retrieval.

Natural-language actions first use high-confidence deterministic parsing for common tasks such as sending to a channel, deleting a requested number of messages, getting SMP IP/status, verification instructions and member bad-word history. Other tasks use live Groq tool calling.

Spark must obey the caller's real Discord permissions and the bot's Discord permissions. It must never claim an action succeeded when the Discord API rejected it.

Discord/API/rate-limit/permission constraints still apply; the bot does not attempt to bypass them.
