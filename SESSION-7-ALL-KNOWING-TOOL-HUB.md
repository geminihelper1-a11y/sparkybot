# Spark Session 7 — All-Knowing / Tool-Hub Upgrade

Spark remains Groq-first for reasoning/chat and Gemini-only for image generation.

## What changed

- Owner is treated as having Spark's useful management authority, so natural requests can actually execute where Discord itself permits them.
- Added live Discord message-history tools:
  - get recent messages from a channel
  - search server history by member, phrase, date range, and bad-language matches
  - fetch exact message context
- Added persistent Spark memory access plus a larger per-member recent conversation window (60 turns stored as compact chat history, alongside long-term facts/preferences).
- Added broad live server overview and Audit Log tools for authorized staff.
- Added useful moderation/management actions:
  - timeout / remove timeout
  - kick / ban with explicit confirmation
  - react to message
  - pin message
  - create/delete channel with confirmation for destructive deletion
  - existing role, purge, send-message, lock/unlock, SMP, backup, task, ticket, report, suggestion, image actions remain available.
- Natural tool routing now recognizes message-history requests such as:
  "what did X say", "last 7 days", "did he swear", "show recent msgs", etc.
- Removed the generic "Spark is having a small brain lag" response.
- Tool-based requests use the strong Groq model when configured.

## Important behavior

Discord remains the source of truth for full message history. Spark does not need to permanently store every Discord message just to answer history questions; it can read permitted history on demand. Access is still bounded by the caller's real Discord permissions, channel visibility, and role hierarchy.

For another member's history, Spark requires owner/admin/audit-log authority. Ordinary members can use their own history where the channel is visible.

The app never trusts text such as "I'm owner"; it checks the real Discord member and permissions.
