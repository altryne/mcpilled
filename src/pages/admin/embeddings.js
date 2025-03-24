import { useState } from 'react';
import Head from 'next/head';

export default function EmbeddingsAdmin() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const generateEmbeddings = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/generate-embeddings', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate embeddings');
      }
      
      setResults(data);
    } catch (err) {
      console.error('Error generating embeddings:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Embeddings Admin | MCP Timeline</title>
      </Head>
      
      <main className="admin-page">
        <h1>Embeddings Management</h1>
        
        <div className="admin-section">
          <h2>Generate Embeddings</h2>
          <p>
            This will generate OpenAI embeddings for entries that don't have them yet.
            The process runs in batches of 50 entries at a time.
          </p>
          
          <button 
            onClick={generateEmbeddings}
            disabled={isGenerating}
            className="admin-button"
          >
            {isGenerating ? 'Generating...' : 'Generate Embeddings'}
          </button>
          
          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
            </div>
          )}
          
          {results && (
            <div className="results-section">
              <h3>Results</h3>
              <p>Processed: {results.processed} entries</p>
              <p>Successful: {results.successful}</p>
              <p>Failed: {results.failed}</p>
              
              {results.failed > 0 && (
                <div>
                  <h4>Failed Entries</h4>
                  <ul>
                    {results.results
                      .filter(r => !r.success)
                      .map(result => (
                        <li key={result.id}>
                          Entry {result.id}: {result.error}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="admin-section">
          <h2>About Vector Search</h2>
          <p>
            This application uses a hybrid search approach combining:
          </p>
          <ul>
            <li>Traditional text search for exact matches</li>
            <li>Vector similarity search for semantic understanding</li>
          </ul>
          <p>
            The OpenAI API key is kept secure on the server side, never exposed to the client.
          </p>
          <p>
            For the vector search to work properly, each entry needs an embedding vector
            generated from its content. This process happens automatically for new entries,
            but existing entries need to be processed using the button above.
          </p>
        </div>
      </main>
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .admin-page h1 {
          margin-bottom: 2rem;
        }
        
        .admin-section {
          margin-bottom: 3rem;
          padding: 1.5rem;
          border: 1px solid #eaeaea;
          border-radius: 8px;
        }
        
        .admin-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          margin: 1rem 0;
        }
        
        .admin-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 1rem;
          border-radius: 4px;
          margin: 1rem 0;
        }
        
        .results-section {
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
