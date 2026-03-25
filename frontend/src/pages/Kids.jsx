import React, { useState } from 'react';
import Card from '../components/Card';
import TextInput from '../components/TextInput';
import OutputBox from '../components/OutputBox';
import VideoLearningSection from '../components/VideoLearningSection';
import { transformContent } from '../services/api';
import { Baby, Star, Wand2, Sparkles, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Kids = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectKeyword, setSubjectKeyword] = useState('');
  const [serverVideoId, setServerVideoId] = useState('');

  const handleTransform = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await transformContent(input, 'Kids Mode');
      setOutput(res.output || []);
      setSubjectKeyword(res.subjectKeyword || input.split(' ').slice(0, 2).join(' '));
      setServerVideoId(res.youtubeId || '');
    } catch (err) {
      console.error('Error transforming content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.3; // Playful high pitch for kids
    utterance.rate = 0.9;  // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page-layout kids-layout">
      <div className="kids-decor">🌈 ⭐ 🚀 🧸</div>

      <header className="hero-section">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="hero-title">
            <Baby size={48} className="inline-block mr-4 text-pink-400" />
            Cartoon Learning
          </h1>
          <p className="hero-subtitle">
            Let's turn your lessons into fun stories and magical adventures!
          </p>
        </motion.div>
      </header>

      <div className="improved-grid">
        <Card 
          title="Animated Input" 
          subtitle="Paste a story or school lesson here!" 
          icon={<Star size={24} className="text-yellow-400" />}
        >
          <TextInput 
            value={input} 
            onChange={setInput} 
            loading={loading} 
            placeholder="e.g., How do bees make honey?" 
          />
          
          <button 
            className="main-action-btn kids-btn" 
            onClick={handleTransform} 
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <Wand2 className="spinning" size={24} />
                <span>Working Magic...</span>
              </>
            ) : (
              <>
                <Sparkles size={24} />
                <span>Make it Playful! ✨</span>
              </>
            )}
          </button>
        </Card>

        <Card 
          title="Your Fun Story" 
          subtitle="Easy to read and full of surprises!" 
          icon={<Star size={24} className="text-yellow-400" />}
        >
          <AnimatePresence mode="wait">
            {output.length > 0 || loading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                key="results"
              >
                <OutputBox 
                  output={output} 
                  loading={loading} 
                  mode="Kids Mode" 
                  onSpeech={handleSpeech} 
                />
              </motion.div>
            ) : (
              <div className="output-box-empty" key="empty">
                <Baby size={64} className="opacity-30 mb-4" />
                <p>Waiting for your magic lesson! ✨</p>
              </div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* 🎠 Full-Width Magical Video Section */}
      {!loading && output.length > 0 && (
         <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              maxWidth: '1250px', 
              margin: '0 auto 4rem', 
              padding: '0 2rem'
            }}
          >
            <div className="kids-media-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '32px' }}>
               <VideoLearningSection mode="Kids Mode" externalTopic={subjectKeyword} serverVideoId={serverVideoId} />
            </div>
          </motion.div>
      )}
    </div>
  );
};

export default Kids;
