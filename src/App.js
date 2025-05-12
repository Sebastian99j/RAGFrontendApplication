import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="chat-container">
      <h1>Multi-LLM RAG</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>💬 Czat</button>
        <button onClick={() => setActiveTab('train')} className={activeTab === 'train' ? 'active' : ''}>📚 Fine-tune GPT-2</button>
      </div>

      {activeTab === 'chat' ? <ChatTab /> : <TrainTab />}
    </div>
  );
}

function ChatTab() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState('ask-openai');
  const [database, setDatabase] = useState('faiss');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, top_k: 2, database })
    });
    const data = await response.json();
    setAnswer(data.answer);
    setHistory([...history, { user: question, bot: data.answer }]);
    setQuestion('');
  };

  return (
    <>
      <div className="chat-box">
        {history.map((entry, index) => (
          <div key={index} className="message-pair">
            <div className="message user">{entry.user}</div>
            <div className="message bot">{entry.bot}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Zadaj pytanie..."
        />
        <div className="controls">
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="ask-openai">OpenAI</option>
            <option value="ask-hf">HuggingFace</option>
            <option value="ask-langchain">LangChain</option>
            <option value="ask-gpt2">GPT-2</option>
            <option value="ask-hf-api">Mistral (HF API)</option>
          </select>
          <select value={database} onChange={(e) => setDatabase(e.target.value)}>
            <option value="faiss">FAISS</option>
            <option value="pinecone">Pinecone</option>
          </select>
          <button type="submit">Wyślij</button>
        </div>
      </form>
    </>
  );
}

function TrainTab() {
  const [examples, setExamples] = useState([{ input: '', output: '' }]);
  const [epochs, setEpochs] = useState(3);
  const [status, setStatus] = useState('');

  const updateExample = (index, field, value) => {
    const updated = [...examples];
    updated[index][field] = value;
    setExamples(updated);
  };

  const addExample = () => setExamples([...examples, { input: '', output: '' }]);

  const handleTrain = async (e) => {
    e.preventDefault();
    setStatus('Trenowanie...');
    const response = await fetch('http://localhost:8000/fine-tune-gpt2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ training_data: examples, epochs })
    });
    const data = await response.json();
    setStatus(data.message || 'Gotowe!');
  };

  return (
    <form onSubmit={handleTrain} className="train-area">
      {examples.map((ex, idx) => (
        <div key={idx} className="train-pair">
          <input
            type="text"
            value={ex.input}
            onChange={(e) => updateExample(idx, 'input', e.target.value)}
            placeholder="Pytanie"
          />
          <input
            type="text"
            value={ex.output}
            onChange={(e) => updateExample(idx, 'output', e.target.value)}
            placeholder="Odpowiedź"
          />
        </div>
      ))}
      <button type="button" onClick={addExample}>➕ Dodaj przykład</button>
      <div className="controls">
        <input
          type="number"
          min="1"
          value={epochs}
          onChange={(e) => setEpochs(parseInt(e.target.value))}
          placeholder="Epoki"
        />
        <button type="submit">🚀 Rozpocznij fine-tuning</button>
      </div>
      {status && <p className="status">{status}</p>}
    </form>
  );
}

export default App;
