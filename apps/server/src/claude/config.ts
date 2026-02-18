export interface ClaudeCliConfig {
  model?: string;
  verbose?: boolean;
  effort?: "low" | "medium" | "high";
  dangerouslySkipPermissions?: boolean;
  outputFormat?: "text" | "json" | "stream-json";
  includePartialMessages?: boolean;
  print?: boolean;
  maxBudgetUsd?: number;
  systemPrompt?: string;
  noSessionPersistence?: boolean;
}

export const DEFAULT_CONFIG: ClaudeCliConfig = {
  print: true,
  outputFormat: "stream-json",
  verbose: true,
  includePartialMessages: true,
  dangerouslySkipPermissions: true,
  model: "haiku",
};

export function buildCliArgs(
  prompt: string,
  config: ClaudeCliConfig = DEFAULT_CONFIG,
): string[] {
  const args: string[] = [];

  if (config.print) {
    args.push("-p", prompt);
  }

  if (config.outputFormat) {
    args.push("--output-format", config.outputFormat);
  }

  if (config.verbose) {
    args.push("--verbose");
  }

  if (config.model) {
    args.push("--model", config.model);
  }

  if (config.includePartialMessages) {
    args.push("--include-partial-messages");
  }

  if (config.dangerouslySkipPermissions) {
    args.push("--dangerously-skip-permissions");
  }

  if (config.effort) {
    args.push("--effort", config.effort);
  }

  if (config.maxBudgetUsd !== undefined) {
    args.push("--max-budget-usd", String(config.maxBudgetUsd));
  }

  if (config.systemPrompt) {
    args.push("--system-prompt", config.systemPrompt);
  }

  if (config.noSessionPersistence) {
    args.push("--no-session-persistence");
  }

  return args;
}
