# Spark NETHRION v6.4 — SECURITY KERNEL

## Security / correctness
- Added a centralized Spark security kernel between Groq reasoning and Discord execution.
- AI can never grant itself authority; real Discord permissions and role hierarchy remain authoritative.
- Added explicit-action gating so server-changing tools cannot be triggered from vague/read-only messages.
- Added critical-action confirmation with same-channel, same-user, 60-second pending state.
- Critical purge runs (>20) now use the same confirmation path as other critical AI actions.
- Added AI moderation tools for warning, timeout, kick and ban with real Discord permission/hierarchy checks.
- Ban is always critical and requires explicit confirmation.
- Added persistent moderation case IDs with moderator, target, reason, duration, evidence/message reference and timestamp.
- Added persistent Spark action audit records with actor, understood action, tool, result, target and action ID.
- Added persistent message edit/delete logs and security event logs with bounded retention.
- Added anti-raid join-spike detection and suspicious-account alerts; quarantine is opt-in rather than silently punitive.
- Added anti-prompt-injection handling: Discord/user-controlled tool output is explicitly marked as untrusted data for Groq and must never be treated as instructions.
- Prevented non-staff `sp profile` output from exposing report counts.
- Switched persistent-state writes to an atomic temp-file + rename flow to reduce data corruption risk.
- Made `data.json` path stable relative to the application directory unless `SPARK_DATA_FILE` is set.

## Behavior
- History remains on-demand; Spark does not continuously scan Discord messages.
- Tool/API failure is represented as failure; Spark is instructed not to claim an action succeeded unless the execution path returned success.
- Existing raw/desi conversation style is preserved.
