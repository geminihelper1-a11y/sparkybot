# Session 6 — Natural Conversation / Reply Variety

Updated Spark chat behavior:

- Added server-wide in-memory reply memory so Spark avoids reusing or closely paraphrasing recent replies across different members.
- Added a similarity gate and fresh-reply retry for repeated or near-duplicate responses.
- Added randomized, optional Gen-Z style cues so wording/openings/rhythm vary naturally.
- Expanded natural Discord typing guidance: lowercase, fragments, casual punctuation, varied rhythm, restrained slang.
- Explicitly avoids forcing slang into every reply.
- Avoids racial slurs/identity-based insults as personality filler.
- Joke requests are instructed to use fresh premises/punchlines rather than repeating the same stock joke.

No DiscordSRV/RCON changes are included in this build.
