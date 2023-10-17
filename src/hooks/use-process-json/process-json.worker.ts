import { ValidationJsonState } from "./types";

const parseJsonWorker = self as unknown as Worker;

parseJsonWorker.onmessage = (event: MessageEvent<File>) => {
  const jsonFile = event.data;

  const defaultPayload: ValidationJsonState = {
    isProcessing: false,
    error: null,
    parsedJson: null,
  };

  jsonFile
    .text()
    .then((text) => {
      const parsedJson = JSON.parse(text);

      const payload = {
        ...defaultPayload,
        parsedJson,
      };

      parseJsonWorker.postMessage(payload);
    })
    .catch((error) => {
      parseJsonWorker.postMessage({
        ...defaultPayload,
        error: (error as Error)?.message ?? "Unknown error",
      });
    });
};

parseJsonWorker.onerror = (error: ErrorEvent) => {
  console.log("Error received from main script");
  parseJsonWorker.postMessage(error);
};
