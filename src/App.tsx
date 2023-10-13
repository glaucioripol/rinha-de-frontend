import { FormEvent, useState } from "react";
import { useProcessJsonFile } from "./hooks/use-process-json";

function App() {
  const [inputFile, setInputFile] = useState<File>();

  const processJsonfile = useProcessJsonFile();

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    processJsonfile.actions.processFile(inputFile!);
  };

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <input
          type="file"
          name="input-file"
          id="input-file"
          placeholder="Select a json to parse"
          accept=".json"
          onChange={(e) => {
            console.log(e.target.files);

            if (e.target.files) {
              const [file] = e.target.files;

              setInputFile(file);
            }
          }}
        />

        <button type="submit">Validate</button>
      </form>

      {processJsonfile.state.isProcessing && <p>Processing...</p>}

      {processJsonfile.state.error && <p>{processJsonfile.state.error}</p>}
    </>
  );
}

export default App;
