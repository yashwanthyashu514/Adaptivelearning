import React, { useState } from 'react';
import Card from '../components/Card';
import TextInput from '../components/TextInput';
import OutputBox from '../components/OutputBox';
import VideoLearningSection from '../components/VideoLearningSection';
import { transformContent } from '../services/api';
import { User, Briefcase, FileText, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const Adult = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectKeyword, setSubjectKeyword] = useState('');
  const [serverVideoId, setServerVideoId] = useState('');

  const handleTransform = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await transformContent(input, 'Adult Mode');
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
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page-layout adult-layout">
      <header className="hero-section">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="hero-title">
            <User size={40} className="inline-block mr-4 text-slate-400" />
            Professional Learning
          </h1>
          <p className="hero-subtitle">
            Formal and structured content for clear, concise, and efficient understanding.
          </p>
        </motion.div>
      </header>

      <div className="improved-grid">
        <Card 
          title="Formal Input" 
          subtitle="Paste documents, emails, or technical articles." 
          icon={<Briefcase size={22} className="text-slate-400" />}
        >
          <TextInput 
            value={input} 
            onChange={setInput} 
            loading={loading} 
            placeholder="Paste source material here..." 
          />
          <button 
            className="main-action-btn" 
            onClick={handleTransform} 
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <div className="loading-spinner small"></div>
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <FileText size={20} />
                <span>Get Executive Summary</span>
              </>
            )}
          </button>
        </Card>

        <Card 
          title="Executive Summary" 
          subtitle="Clear key takeaways and detailed points." 
          icon={<ClipboardList size={22} className="text-slate-400" />}
        >
          <OutputBox 
            output={output} 
            loading={loading} 
            mode="Adult Mode" 
            onSpeech={handleSpeech} 
          />
        </Card>
      </div>

      {/* 🚢 Full-Width Professional Dashboard */}
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
            <VideoLearningSection mode="Adult Mode" externalTopic={subjectKeyword} serverVideoId={serverVideoId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Adult;
