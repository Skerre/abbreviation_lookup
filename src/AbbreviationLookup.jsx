import { useState, useEffect } from "react";
import "./index.css";

export default function AbbreviationLookup() {
  const [abbreviations, setAbbreviations] = useState({});
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/abbreviations_cleaned.json")
      .then((response) => response.json())
      .then((data) => setAbbreviations(data))
      .catch((error) => console.error("Error loading abbreviations:", error));
  }, []);

  const handleSearch = () => {
    const abbreviation = input.trim().toUpperCase();
    if (abbreviation in abbreviations) {
      const values = abbreviations[abbreviation];
      setResult(
        <div className="space-y-2">
          {Array.isArray(values)
            ? values.map((v, index) => (
                <div key={index} className="break-words">- {v}</div>
              ))
            : <div className="break-words">- {values}</div>}
        </div>
      );
    } else {
      setResult("No definition found.");
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-4 shadow-lg bg-white">
        <h2 className="text-xl font-bold text-center mb-4">UNDP Abbreviation Lookup Tool</h2>
        <input
          type="text"
          placeholder="Enter abbreviation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSearch()}
          className="search"
        />
        <button onClick={handleSearch} className= "button button2">
          Search
        </button>
        <button onClick={() => setShowAll(!showAll)} className="button button2">
          {showAll ? "Hide All" : "Show All"}
        </button>

        {result && (
          <div className="p-4 mt-4 text-left bg-gray-200 border rounded w-full">
            <br></br>
            <strong>Result:</strong>
            <div className="mt-2 space-y-2">{result}</div>
          </div>
        )}
      </div>

      {showAll && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 max-h-96 overflow-y-auto w-80 border rounded">
            <h2 className="text-lg font-bold">All Abbreviations</h2>
            <ul className="space-y-2">
              {Object.entries(abbreviations).map(([abbr, definition]) => (
                <li key={abbr} className="border-b p-2">
                  <strong>{abbr}:</strong>
                  <div className="mt-1 space-y-2">
                    {Array.isArray(definition)
                      ? definition.map((v, index) => (
                          <div key={index} className="break-words">- {v}</div>
                        ))
                      : <div className="break-words">- {definition}</div>}
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowAll(false)} className="w-full mt-2 p-2 text-white rounded">Close</button>
          </div>
        </div>
      )}
      <footer className="w-full text-center p-4 bg-gray-200 text-gray-700 text-sm mt-auto">
        © {new Date().getFullYear()} martin.szigeti@undp.org. All rights reserved.
      </footer> 
    </div>
  );

}
