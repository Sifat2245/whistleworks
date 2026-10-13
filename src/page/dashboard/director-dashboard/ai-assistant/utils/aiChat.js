export const parseWidgetPayload = (payload) => {
  if (typeof payload !== "string") return payload;
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
};

export const normalizeAiMessage = (message, animate = false) => ({
  ...message,
  id: message.id ?? crypto.randomUUID(),
  role: message.role || (message.sender === "user" ? "user" : "assistant"),
  content:
    typeof message.content === "string"
      ? message.content
      : typeof message.text === "string"
        ? message.text
        : "",
  widget_payload: parseWidgetPayload(message.widget_payload),
  animate,
});

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const formatAiMention = (entity) => `@${entity.name} (ID: ${entity.id})`;

export const buildAiPrompt = (text, mentions = [], camp = null) => {
  let prompt = text.trim();
  // Replace in one pass so a shorter name cannot consume a longer mention.
  const entities = [...mentions, ...(camp ? [camp] : [])]
    .filter(
      (entity) => entity?.name && entity.id !== undefined && entity.id !== null,
    )
    .sort((a, b) => b.name.length - a.name.length);
  if (entities.length) {
    const names = [...new Set(entities.map((entity) => entity.name))];
    const pattern = new RegExp(
      `@(${names.map(escapeRegex).join("|")})(?=$|[\\s.,!?;:])(?:\\s*\\((?:(?:Referee|Evaluator)\\s+)?ID:\\s*([^)]+)\\))?`,
      "gi",
    );
    prompt = prompt.replace(pattern, (original, name, id) => {
      const candidates = entities.filter(
        (entity) => entity.name.toLowerCase() === name.toLowerCase(),
      );
      const entity =
        id !== undefined
          ? candidates.find((candidate) => String(candidate.id) === id.trim())
          : candidates.length === 1
            ? candidates[0]
            : null;
      return entity ? formatAiMention(entity) : original;
    });
  }
  if (camp) {
    prompt = prompt.replace(
      /across all (?:my )?camps/gi,
      () => `for ${formatAiMention(camp)}`,
    );
    if (!prompt.includes(formatAiMention(camp)))
      prompt += `\n\nUse ${formatAiMention(camp)} as the camp scope.`;
  } else if (!/all (?:my )?camps/i.test(prompt)) {
    prompt += "\n\nAcross all my camps.";
  }
  return prompt;
};

export const aiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;
