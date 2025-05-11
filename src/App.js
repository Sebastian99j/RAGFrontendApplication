import React, { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState('ask-openai');
  const [database, setDatabase] = useState('faiss');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, top_k: 2 })
    });
    const data = await response.json();
    setAnswer(data.answer);
  };

  return (
    <div className="App">
      <h1>Multi-LLM RAG</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Zadaj pytanie..."
          rows={4}
        />
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="ask-openai">OpenAI</option>
          <option value="ask-hf">HuggingFace</option>
          <option value="ask-langchain">LangChain</option>
          <option value="ask-gpt2">GPT2</option>
          <option value="ask-hf-api">Mistral (HF API)</option>
        </select>
        <select value={database} onChange={(e) => setDatabase(e.target.value)}>
          <option value="faiss">FAISS</option>
          <option value="pinecone">Pinecone</option>
        </select>
        <button type="submit">Wyślij</button>
      </form>
    <div className="answer">
      <h2>Odpowiedź:</h2>
      <p>{answer}</p>
    </div>
    </div>
  );
}

export default App;
