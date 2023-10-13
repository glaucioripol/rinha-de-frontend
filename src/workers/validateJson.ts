const worker = self as unknown as Worker;

worker.onmessage = (event: MessageEvent<File>) => {
  const jsonFile = event.data;

  jsonFile
    .text()
    .then((text) => {
      const parsedJson = JSON.parse(text);

      worker.postMessage({
        isProcessing: false,
        error: null,
        parsedJson,
      });
    })
    .catch((error) => {
      worker.postMessage({
        error: (error as Error)?.message ?? "Unknown error",
        isProcessing: false,
        parsedJson: null,
      });
    });
};

worker.onerror = (error: ErrorEvent) => {
  console.log("Error received from main script");
  worker.postMessage(error);
};
