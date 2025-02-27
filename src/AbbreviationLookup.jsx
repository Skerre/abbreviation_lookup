import { useState, useEffect } from "react";
import "./index.css";

export default function AbbreviationLookup() {
  const [abbreviations, setAbbreviations] = useState({});
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("./abbreviations_cleaned.json")
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
    <div className="page-container">
      <div className="content-area">
        <div className="search-container">
          <h2 className="header-text">UNDP Abbreviation Lookup Tool</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter abbreviation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSearch()}
              className="search"
            />
            <div className="button-group">
              <button onClick={handleSearch} className="button button2">
                Search
              </button>
              <button onClick={() => setShowAll(!showAll)} className="button button2">
                {showAll ? "Hide All" : "Show All"}
              </button>
            </div>
          </div>

          {result && (
            <div className="result-box">
              <strong>Result:</strong>
              <div className="result-content">{result}</div>
            </div>
          )}
        </div>
      </div>

      {showAll && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h2 className="modal-header">All Abbreviations</h2>
              <div className="abbreviation-scrollarea">
                <ul className="abbreviation-list">
                  {Object.entries(abbreviations).map(([abbr, definition]) => (
                    <li key={abbr} className="abbreviation-item">
                      <strong>{abbr}:</strong>
                      <div className="definition-box">
                        {Array.isArray(definition)
                          ? definition.map((v, index) => (
                              <div key={index} className="definition-item">- {v}</div>
                            ))
                          : <div className="definition-item">- {definition}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowAll(false)} className="close-button">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="page-footer">
        © {new Date().getFullYear()} martin.szigeti@undp.org. All rights reserved.
      </footer>
    </div>
  );
}