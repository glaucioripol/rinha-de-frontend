import { useCallback, useState } from "react";
import { ValidationJsonState } from "./types";

const validateJsonWorker = new Worker(
  new URL("./process-json.worker.ts", import.meta.url)
);

export function useProcessJsonFile() {
  const [validationJsonState, setValidationJsonState] =
    useState<ValidationJsonState>({
      parsedJson: null,
      isProcessing: false,
      error: null,
    });

  const stateHandler = useCallback((state: Partial<ValidationJsonState>) => {
    setValidationJsonState((previousState) => ({
      ...previousState,
      ...state,
    }));
  }, []);

  validateJsonWorker.onmessage = useCallback(
    ({ data }: MessageEvent<ValidationJsonState>) => {
      console.log({ data });
      stateHandler(data);
    },
    [stateHandler]
  );

  const processFile = (file: File) => {
    stateHandler({ isProcessing: true, error: null });
    validateJsonWorker.postMessage(file);
  };

  return {
    state: validationJsonState,
    actions: {
      processFile,
    },
  };
}
