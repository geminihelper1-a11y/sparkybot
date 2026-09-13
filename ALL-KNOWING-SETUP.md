# Spark NETHRION — All-Knowing / All-Action v8.0

Spark uses Discord itself as the live source of truth and Groq as the reasoning layer.

## What is now covered
- Live server structure: members, roles, channels, voice activity, server stats, scheduled events, invites, audit log.
- Live SMP information and status.
- Message history search across every inspectable text channel/thread for the requested time range; no artificial 30-day/15,000-message cap.
- Exact member-history checks for things such as bad language, insults, keywords, or what someone said.
- Durable Spark conversation archive on disk plus long-term per-member memory.
- Natural-language actions for sending/editing/deleting messages, purge, pins, reactions, channels/categories/threads, roles, timeouts/kicks/bans, scheduled events, tasks, backups, suggestions, tickets, SMP configuration, and other existing Spark features.
- A `get_bot_permissions` tool so Spark can tell the caller exactly which Discord permission is blocking an action instead of pretending it happened.

## Discord-side requirement
Spark can only do what Discord permits. For broad server operations, give Spark's bot role the required permissions; for maximum practical coverage, use Administrator and place Spark's bot role high enough in the role hierarchy to manage the roles it is supposed to manage. Discord still prevents bots from acting on the server owner and on roles above the bot / managed integration roles.

## Important history behavior
Discord is the source of truth for server message history. Spark does not need to have been online when an old message was sent. It can query the stored Discord history when asked.

The durable local archive stores Spark conversations for continuity; it is not a replacement for Discord's historical message store.

## Privacy / authorization
Another member's message history and Spark memory are staff/audit-authority operations. Spark checks the caller's real Discord permissions before exposing them.

## Deployment
Keep `index.js`, `package.json`, and `package-lock.json` at the project root. Deploy this folder as-is.
