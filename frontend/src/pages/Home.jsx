import React, { useState } from 'react';
import Card from '../components/Card';
import TextInput from '../components/TextInput';
import OutputBox from '../components/OutputBox';
import VideoLearningSection from '../components/VideoLearningSection';
import { transformContent } from '../services/api';
import { Brain, Activity, Zap, Sparkles } from 'lucide-react';

const Home = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('Normal Mode');
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectKeyword, setSubjectKeyword] = useState('');
  const [serverVideoId, setServerVideoId] = useState('');

  const handleTransform = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      // 🔥 Mode mapping (IMPORTANT FIX)
      let backendMode = mode;
      if (mode === "Normal Mode") backendMode = "Student Mode";
      if (mode === "Dyslexia Mode") backendMode = "Visual Mode";

      const res = await transformContent(input, backendMode);
      setOutput(res.output || []);
      setSubjectKeyword(res.subjectKeyword || input.split(' ').slice(0, 3).join(' '));
      setServerVideoId(res.youtubeId || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page-layout">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Adaptive Learning Platform</h1>
        <p className="hero-subtitle">
          Intelligent learning tailored for every individual. Choose a mode that works best for you.
        </p>

        {/* Mode Selection Buttons */}
        <div className="modes-row">
          {[
            { name: 'Normal Mode', icon: <Brain size={20} /> },
            { name: 'Dyslexia Mode', icon: <Activity size={20} /> },
            { name: 'ADHD Mode', icon: <Zap size={20} /> }
          ].map(m => (
            <button
              key={m.name}
              className={`mode-btn ${mode === m.name ? 'active' : ''}`}
              onClick={() => setMode(m.name)}
            >
              {m.icon}
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid: Input and Textual Output */}
      <div className="improved-grid">
        {/* Left Side: Source Material */}
        <Card
          title="Source Material"
          subtitle="Define the topic or paste content you want to adapt."
        >
          <TextInput
            value={input}
            onChange={setInput}
            loading={loading}
            placeholder="Enter topic (e.g., Solar System) or paste text here..."
          />

          <button
            className="main-action-btn"
            onClick={handleTransform}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <div className="loading-spinner small"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Learning</span>
              </>
            )}
          </button>
        </Card>

        {/* Right Side: Adapted Content */}
        <Card
          title="Adapted Content"
          subtitle="Your personalized learning material will appear here."
        >
          <OutputBox
            output={output}
            loading={loading}
            mode={mode}
            onSpeech={handleSpeech}
          />
        </Card>
      </div>

      {/* 🚀 Study Dashboard: Full Width Video & Notes */}
      {!loading && output.length > 0 && (
        <div 
          className="study-dashboard-area"
          style={{ 
            maxWidth: '1250px', 
            margin: '0 auto 4rem', 
            padding: '0 2rem',
            animation: 'fadeInUp 0.6s ease-out'
          }}
        >
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
            <VideoLearningSection mode={mode} externalTopic={subjectKeyword} serverVideoId={serverVideoId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;