"use strict";
import "server-only";

/**
 * Prompt validation and sanitization utilities
 * Prevents prompt injection and ensures required instructions are present
 */

// Common prompt injection patterns to neutralize
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|earlier|above)\s+instructions?/gi,
  /forget\s+(all\s+)?(previous|prior|earlier|above)\s+instructions?/gi,
  /disregard\s+(all\s+)?(previous|prior|earlier|above)\s+instructions?/gi,
  /override\s+(all\s+)?(previous|prior|earlier|above)\s+instructions?/gi,
  /you\s+are\s+now\s+(a|an)\s+/gi,
  /from\s+now\s+on\s+you\s+are/gi,
  /your\s+new\s+(role|instructions?|task)/gi,
  /system\s*:\s*ignore/gi,
  /\[INST\]/gi,
  /\[\/INST\]/gi,
  /<\|system\|>/gi,
  /<\|assistant\|>/gi,
];

// Required keywords that must be present for JSON output features
const REQUIRED_JSON_KEYWORDS = [
  /return\s+only\s+(a\s+)?json/gi,
  /return\s+json\s+object/gi,
  /json\s+format/gi,
  /json\s+object/gi,
  /only\s+json/gi,
];

const REQUIRED_STRUCTURE_KEYWORDS = {
  json: REQUIRED_JSON_KEYWORDS,
  "json-array": [
    ...REQUIRED_JSON_KEYWORDS,
    /json\s+array/gi,
    /array\s+of/gi,
  ],
};

/**
 * Sanitize prompt to prevent injection attacks
 */
export function sanitizePrompt(prompt: string): string {
  let sanitized = prompt;

  // Remove or neutralize prompt injection patterns
  PROMPT_INJECTION_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(
      pattern,
      "[Neutralized: Instruction override attempt]"
    );
  });

  // Remove excessive whitespace but preserve intentional formatting
  sanitized = sanitized.replace(/\n{4,}/g, "\n\n\n");

  return sanitized.trim();
}

/**
 * Validate that prompt contains required instructions
 */
export function validatePrompt(
  prompt: string,
  outputFormat: string,
  validationRules: string[] = []
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for required JSON format instructions
  if (outputFormat === "json" || outputFormat === "json-array") {
    const requiredKeywords = REQUIRED_STRUCTURE_KEYWORDS[outputFormat as keyof typeof REQUIRED_STRUCTURE_KEYWORDS] || REQUIRED_JSON_KEYWORDS;
    const hasRequiredKeyword = requiredKeywords.some((pattern) =>
      pattern.test(prompt)
    );

    if (!hasRequiredKeyword) {
      errors.push(
        `Prompt must contain JSON format instructions for ${outputFormat} output format`
      );
    }
  }

  // Check custom validation rules
  validationRules.forEach((rule) => {
    switch (rule) {
      case "must-contain-json":
        if (!REQUIRED_JSON_KEYWORDS.some((pattern) => pattern.test(prompt))) {
          errors.push("Prompt must contain JSON format requirements");
        }
        break;
      case "must-contain-summary":
        if (!/summary|summarize|brief\s+summary/gi.test(prompt)) {
          errors.push("Prompt must contain summary instructions");
        }
        break;
      case "must-contain-score":
        if (!/score|rating|0-100|percentage/gi.test(prompt)) {
          errors.push("Prompt must contain scoring instructions");
        }
        break;
      // Add more validation rules as needed
    }
  });

  // Check for prompt injection attempts
  PROMPT_INJECTION_PATTERNS.forEach((pattern) => {
    if (pattern.test(prompt)) {
      errors.push("Prompt contains potentially dangerous injection patterns");
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Build final prompt with mandatory instructions appended
 */
export function buildFinalPrompt(
  systemPrompt: string,
  mandatoryInstructions?: string | null,
  outputFormat: string = "text"
): string {
  let finalPrompt = sanitizePrompt(systemPrompt);

  // Always append mandatory instructions if they exist
  if (mandatoryInstructions) {
    finalPrompt = `${finalPrompt}\n\n---\n\n${sanitizePrompt(mandatoryInstructions)}`;
  }

  // For JSON outputs, ensure format instructions are present
  if ((outputFormat === "json" || outputFormat === "json-array") && mandatoryInstructions) {
    // Mandatory instructions should already contain JSON requirements
    // But we can double-check and append if missing
    const hasJsonInstruction = REQUIRED_JSON_KEYWORDS.some((pattern) =>
      pattern.test(finalPrompt)
    );

    if (!hasJsonInstruction && mandatoryInstructions) {
      // If mandatory instructions don't have JSON format, it's a configuration error
      // We'll log a warning but still use the mandatory instructions
      console.warn(
        `Warning: Mandatory instructions for ${outputFormat} feature should include JSON format requirements`
      );
    }
  }

  return finalPrompt.trim();
}

/**
 * Get default mandatory instructions for a feature based on output format
 */
export function getDefaultMandatoryInstructions(
  outputFormat: string,
  jsonSchema?: string | null
): string {
  switch (outputFormat) {
    case "json":
      return `CRITICAL: You MUST return ONLY a valid JSON object. Do not include any markdown formatting, code blocks, explanations, or additional text. Return pure JSON that can be parsed directly.${jsonSchema ? `\n\nRequired JSON structure:\n${jsonSchema}` : ""}`;
    
    case "json-array":
      return `CRITICAL: You MUST return ONLY a valid JSON array. Do not include any markdown formatting, code blocks, explanations, or additional text. Return pure JSON that can be parsed directly.${jsonSchema ? `\n\nRequired JSON structure:\n${jsonSchema}` : ""}`;
    
    case "text":
      return `CRITICAL: Return ONLY the requested content. Do not include explanations, meta-commentary, or formatting marks unless specifically requested.`;
    
    case "stream":
      return `Return the response as a stream of text without additional formatting.`;
    
    default:
      return "";
  }
}

/**
 * Neutralize common injection attempts in user-provided content
 * (Used when interpolating user data into prompts)
 */
export function sanitizeUserContent(content: string): string {
  let sanitized = content;

  // Remove common injection markers but preserve legitimate content
  const injectionMarkers = [
    /system\s*:/gi,
    /assistant\s*:/gi,
    /user\s*:/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
  ];

  injectionMarkers.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "[sanitized]");
  });

  return sanitized;
}
