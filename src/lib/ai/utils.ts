export function cleanAIResponse(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  // Fix bad control characters inside JSON strings that break JSON.parse
  // This replaces literal control chars (0x00–0x1F except tab) inside string values
  cleaned = cleaned.replace(
    /"(?:[^"\\]|\\.)*"/g,
    (match) => match.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
  );

  return cleaned;
}

export function parseAIJson(text: string) {
  const cleaned = cleanAIResponse(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    let inString = false;
    let escaped = false;
    let repaired = '';

    for (const char of cleaned) {
      if (escaped) {
        repaired += char;
        escaped = false;
        continue;
      }

      if (char === '\\') {
        repaired += char;
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        repaired += char;
        continue;
      }

      if (inString && char === '\n') {
        repaired += '\\n';
        continue;
      }

      if (inString && char === '\r') {
        continue;
      }

      repaired += char;
    }

    return JSON.parse(repaired);
  }
}
