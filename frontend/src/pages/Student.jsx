import React, { useState } from 'react';
import Card from '../components/Card';
import TextInput from '../components/TextInput';
import OutputBox from '../components/OutputBox';
import VideoLearningSection from '../components/VideoLearningSection';
import { transformContent } from '../services/api';
import { GraduationCap, BookOpen, Layers, Image as ImageIcon, Map, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Student = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectKeyword, setSubjectKeyword] = useState('');
  const [serverVideoId, setServerVideoId] = useState('');

  const handleTransform = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await transformContent(input, 'Student Mode');
      setOutput(res.output || []);
      setSubjectKeyword(res.subjectKeyword || input.split(' ').slice(0, 2).join(' '));
      setServerVideoId(res.youtubeId || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRealisticImage = (keyword) => {
    if (!keyword) return null;
    return `https://source.unsplash.com/1200x800/?${encodeURIComponent(keyword)},educational,diagram,science,hd,clean`;
  };

  const handleSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page-layout student-layout">
      <header className="hero-section">
        <motion.div
           initial={{ y: -20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="hero-title">
            <GraduationCap size={44} className="inline-block mr-4 text-blue-400" />
            Visual Learning
          </h1>
          <p className="hero-subtitle">
            Highly structured concept mapping, diagrams, and visual breakdowns for complex subjects.
          </p>
        </motion.div>
      </header>

      <div className="improved-grid">
        <Card 
          title="Concept Input" 
          subtitle="Structural breakdown for abstract ideas (e.g., Solar System)." 
          icon={<Layers size={22} className="text-blue-400" />}
        >
          <TextInput 
            value={input} 
            onChange={setInput} 
            loading={loading} 
            placeholder="Paste textbooks or paste complex concepts here..." 
          />
          <button 
            className="main-action-btn student-btn" 
            onClick={handleTransform} 
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <div className="loading-spinner small"></div>
                <span>Visualizing...</span>
              </>
            ) : (
              <>
                <Map size={20} />
                <span>Map Concepts</span>
              </>
            )}
          </button>
        </Card>

        <Card 
          title="Structural Map" 
          subtitle="A visual-friendly breakdown with diagrams and key notes." 
          icon={<ImageIcon size={22} className="text-blue-400" />}
        >
          <AnimatePresence mode="wait">
            {output.length > 0 || loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="results"
              >
                <OutputBox 
                  output={output} 
                  loading={loading} 
                  mode="Student Mode" 
                  onSpeech={handleSpeech} 
                />

                {!loading && output.length > 0 && (
                  <div className="mt-8 space-y-6">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-4">
                      <h4 className="flex items-center gap-2 text-blue-300 font-semibold mb-3">
                         <Search size={18} /> Visual Breakdown: {subjectKeyword}
                      </h4>
                      <img
                        src={getRealisticImage(subjectKeyword)}
                        alt={subjectKeyword}
                        className="w-full rounded-lg shadow-xl hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x800?text=Realistic+Scientific+Visual'; }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="output-box-empty" key="empty">
                <BookOpen size={64} className="opacity-30 mb-4" />
                <p>Map your concepts for a structured visual experience.</p>
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* 🚢 Full-Width Study Dashboard */}
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
            <VideoLearningSection mode="Normal Mode" externalTopic={subjectKeyword} serverVideoId={serverVideoId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
