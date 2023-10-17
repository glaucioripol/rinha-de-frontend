import { FormEvent, useCallback, useMemo, useState } from "react";
import { useProcessJsonFile } from "./hooks/use-process-json";

type GenericJson =
  | Record<string, string | number | object | unknown[]>
  | unknown;

export default function App() {
  const [inputFile, setInputFile] = useState<File>();

  const {
    state: { parsedJson, isProcessing, error },
    actions: { processFile },
  } = useProcessJsonFile();

  const handleOnSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      processFile(inputFile!);
    },
    [inputFile, processFile]
  );

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

      {isProcessing && <p>Processing...</p>}

      {error && <p>{error}</p>}

      {useMemo(() => {
        if (parsedJson) {
          return renderObject(parsedJson, "root");
        }
      }, [parsedJson])}
    </>
  );
}

const baseStyle = {
  borderLeft: "1px solid #000",
  padding: "0 0 0 1rem",
  margin: "0.2rem 0 0 0.2rem",
  listStyle: "none",
};

const types = ["string", "number", "boolean", "bigint", "symbol", "undefined"];
function renderObject(obj: GenericJson, key: string | number) {
  if (types.includes(typeof obj) || obj === null) {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return (
      <ul key={key} style={baseStyle}>
        {obj.map((item, index) => (
          <li key={index}>{renderObject(item, index)}</li>
        ))}
      </ul>
    );
  }

  if (Object.keys(obj!).length === 0) {
    return <li key={key}>Empty object</li>;
  }

  return (
    <ul key={key} style={baseStyle} data-id={key}>
      {Object.entries(obj!).map(([property, value], index) => (
        <li key={index}>
          {property}:{` `}
          {typeof value === "object" && value !== null
            ? renderObject(value, index)
            : JSON.stringify(value)}
        </li>
      ))}
    </ul>
  );
}
