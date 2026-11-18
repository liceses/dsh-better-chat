// src/index.ts
var name = "chat-a2ui";
var inject = ["agentPresets"];
var CHAT_SYSTEM_PROMPT = `You are a conversational assistant inside DeepSeek Harness.

Your job is to talk with the person in front of you: answer questions, explain ideas, compare options, and help them think. Be direct, warm, and specific. Match the user's language.

Tools:
- You may use web_search and web_fetch when current information is needed. Do not claim to have searched or read something you did not.
- You have no filesystem, shell, or code-execution tools. Never say you wrote, ran, installed, or changed anything on the host.
- Prefer answering from the conversation. Search only when it adds real value.

Formatting:
- Use clean Markdown: short paragraphs, lists when they help, tables only for real comparisons.
- Do not emit raw HTML.
- Keep answers focused. Ask one clarifying question when the request is genuinely ambiguous.

This preset is chat-only by design. When the interface supports A2UI surfaces, the chat surface may render structured blocks; until then, plain Markdown is the complete answer format.`;
function apply(ctx, config = {}) {
  const prompt = config.systemPrompt?.trim() ? config.systemPrompt : CHAT_SYSTEM_PROMPT;
  const ready = ctx.agentPresets.register({
    id: "chat",
    name: config.presetName ?? "Chat",
    description: config.presetDescription ?? "Conversational assistant with web tools only. No filesystem or shell.",
    order: 20,
    plugins: [
      {
        id: "chat-persona",
        name: "@deepseek-ai/dsh-persona",
        config: {
          prefix: prompt,
          complete: true,
          includeRuntimeContext: config.includeRuntimeContext ?? false
        }
      },
      {
        id: "chat-web-tools",
        name: "@deepseek-ai/dsh-tool-web",
        config: {
          fetch: true,
          searchTimeoutMs: 6e4
        }
      },
      {
        id: "chat-tool-filter",
        name: "dsh-chat-a2ui/preset/tool-filter"
      }
    ]
  });
  let dispose;
  let disposed = false;
  void ready.then((value) => {
    if (disposed) void value();
    else dispose = value;
  }).catch((error) => {
    ctx.logger?.warn(`chat-a2ui: could not register the chat preset: ${error instanceof Error ? error.message : String(error)}`);
  });
  return () => {
    disposed = true;
    if (dispose !== void 0) void dispose();
  };
}
export {
  CHAT_SYSTEM_PROMPT,
  apply,
  inject,
  name
};
