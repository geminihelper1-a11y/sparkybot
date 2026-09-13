# Session 5 — Provider separation + reliability fix

## Provider split
- Groq is the only provider used for Spark chat, reasoning, server tools, natural-language command understanding, summaries and task-related AI.
- Gemini is the only provider used for image generation.
- `GROQ_API_KEY` is required for Spark AI/chat.
- `GEMINI_API_KEY` is required only for image generation.
- `GEMINI_IMAGE_MODEL` defaults to `gemini-3.1-flash-image`.

## Chat reliability
- Ordinary conversation is routed directly to Groq instead of forcing every casual message through the tool loop.
- Live/server/action requests still use Spark's live tools.
- If tool orchestration fails, Spark falls back to a normal Groq reply instead of going silent.
- Tool calling explicitly disables parallel tool calls for the GPT-OSS 20B path.

## Image generation
- `sp image <prompt>` goes directly to Gemini and no longer depends on OpenAI or the Groq chat path.
- Natural `@Spark` image requests can still invoke Spark's image tool, which uses Gemini.
- Output is requested as a 16:9 2K PNG with the NETHRION image style guide applied.

## Admin help
- `sp help admin` is handled before other command branches and accepts server owner or Administrator.

## Railway variables
```env
DISCORD_TOKEN=...
GROQ_API_KEY=...
GROQ_MODEL=openai/gpt-oss-20b
GROQ_STRONG_MODEL=openai/gpt-oss-120b
GEMINI_API_KEY=...
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
```

No OpenAI API key is required or used by this build.
