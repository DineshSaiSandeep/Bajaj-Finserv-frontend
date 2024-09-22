import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState(
    '{"data":["M","1","334","4","B","a","C","c"], \n "file_b64": "data:text/plain;base64,SGVsbG8sIHRoaXMgaXMgYSBzYW1wbGUgdGV4dCBmaWxlIGZvciB0ZXN0aW5nIGJhc2U2NC1lbmNvZGVkIGZpbGUgdXBsb2Fkcy4KCklmIHlvdSBjYW4gcmVhZCB0aGlzLCB0aGUgZGVjb2RpbmcgaGFzIHdvcmtlZCBjb3JyZWN0bHkhCgpIYXZlIGEgZ3JlYXQgZGF5IQ=="}'
  );
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post(
        "https://bajaj-finserv-backend-z2xh.onrender.com/bfhl",
        parsedInput
      );
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value && !selectedFilters.includes(value)) {
      setSelectedFilters([...selectedFilters, value]);
    }
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter));
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    return (
      <div className="filtered-response">
        {selectedFilters.includes("numbers") && (
          <div>
            <h3>Numbers:</h3>
            <p>{response.numbers.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("alphabets") && (
          <div>
            <h3>Alphabets:</h3>
            <p>{response.alphabets.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("highest_lowercase_alphabet") && (
          <div>
            <h3>Highest Lowercase Alphabet:</h3>
            <p>{response.highest_lowercase_alphabet.join(", ")}</p>
          </div>
        )}
        {selectedFilters.includes("file_information") && (
          <div>
            <h3>File Information:</h3>
            {response.file_valid ? (
              <>
                <p>File Valid: Yes</p>
                <p>File MIME Type: {response.file_mime_type}</p>
                <p>File Size: {response.file_size_kb} KB</p>
              </>
            ) : (
              <p>No file information available</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>D. Dinesh Sai Sandeep</h1>
      <h1>AP21110011517</h1>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="apiInput">API Input</label>
          <textarea
            id="apiInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter JSON input, e.g. {"data": ["A","1","B","2","a","c"]}'
          />
          <button type="submit">Submit</button>
        </form>
        {error && <p className="error">{error}</p>}
        {response && (
          <div className="response-section">
            <div className="filter-container">
              <label htmlFor="multiFilter">Multi Filter</label>
              <select id="multiFilter" onChange={handleFilterChange} value="">
                <option value="">Select filter</option>
                <option value="numbers">Numbers</option>
                <option value="alphabets">Alphabets</option>
                <option value="highest_lowercase_alphabet">
                  Highest Lowercase Alphabet
                </option>
                <option value="file_information">File Information</option>
              </select>
              <div className="selected-filters">
                {selectedFilters.map((filter) => (
                  <span key={filter} className="filter-tag">
                    {filter.replace(/_/g, " ")}
                    <button onClick={() => removeFilter(filter)}>×</button>
                  </span>
                ))}
              </div>
            </div>
            <h3>Filtered Response</h3>
            {renderFilteredResponse()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
