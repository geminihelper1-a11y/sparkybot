# Spark NETHRION v6.3 — REAL ACTION + LIVE HISTORY FIX

Built from the user-supplied Spark-NETHRION-RAW-DESI-CONSCIOUS-v6.2 base.

## What changed
- Added a deterministic natural-language action router before the AI response path for common admin operations.
- `@Spark send message in #channel say ...` now resolves the actual Discord channel and sends the message instead of relying only on model tool selection.
- `delete/purge N messages` routes directly to the purge operation.
- Natural SMP/IP requests read the configured live Spark SMP data directly.
- Added on-demand cross-channel Discord message-history scanning for staff/owner use, with date windows, member targeting, keyword support, and bad-word detection.
- Added live audit-log lookup.
- Added live server overview and channel-info tools.
- Added natural channel rename/topic/slowmode, nickname, specific-message delete, pin/unpin, and reaction tools.
- Owner authority now exposes privileged AI tools even when a separate permission flag is not present in the cached member permission list; actual Discord API permissions and role hierarchy still decide whether an operation succeeds.
- Tool orchestration now forces tool use for clear action/live-data requests instead of allowing the model to answer without performing the requested action.
- Preserved existing raw/desi conversation style from v6.2.

## On-demand behavior
Spark does not continuously scan server history. History is fetched only when a user explicitly asks for it.

## Limitations
Discord's actual permissions, role hierarchy, channel visibility, API rate limits, and message-history availability still apply.
