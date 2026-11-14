import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/documents`);
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Document uploaded successfully!');
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setSearching(true);
    try {
      const response = await axios.post(`${API_URL}/search`, {
        query,
        limit: 5,
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/documents/${id}`);
      alert('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete document');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cross-Language Semantic Search Engine</h1>
        <p>Search documents in any language using semantic understanding</p>
      </header>

      <main className="App-main">
        <section className="upload-section">
          <h2>Upload Documents</h2>
          <div className="upload-container">
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".txt,.md,.json,.csv"
              className="file-input"
            />
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="btn btn-primary"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <div className="documents-list">
            <h3>Uploaded Documents ({documents.length})</h3>
            {documents.length === 0 ? (
              <p className="no-documents">No documents uploaded yet</p>
            ) : (
              <ul>
                {documents.map((doc) => (
                  <li key={doc.id} className="document-item">
                    <span className="document-name">{doc.filename}</span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="search-section">
          <h2>Semantic Search</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query in any language..."
              className="search-input"
            />
            <button
              type="submit"
              disabled={searching}
              className="btn btn-primary"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {results.length > 0 && (
            <div className="results-section">
              <h3>Search Results</h3>
              {results.map((result, index) => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <span className="result-rank">#{index + 1}</span>
                    <span className="result-filename">{result.filename}</span>
                    <span className="result-similarity">
                      {(result.similarity * 100).toFixed(1)}% match
                    </span>
                  </div>
                  <div className="result-content">
                    {result.content.substring(0, 500)}
                    {result.content.length > 500 && '...'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && query && !searching && (
            <p className="no-results">No results found</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
