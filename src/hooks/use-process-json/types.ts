export type ValidationJsonState = {
  parsedJson: Record<string, unknown> | null;
  isProcessing: boolean;
  error: string | null;
};
