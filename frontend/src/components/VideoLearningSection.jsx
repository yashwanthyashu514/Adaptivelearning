import React, { useState, useEffect } from 'react';

const VideoLearningSection = ({ externalTopic, serverVideoId, mode }) => {
  const [topic, setTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  const isKids = mode === 'Kids Mode';
  const isAdult = mode === 'Adult Mode';
  const isADHD = mode === 'ADHD Mode';

  // Sync with external topic or server-side ID
  useEffect(() => {
    if (serverVideoId) {
      setVideoUrl(`https://www.youtube.com/embed/${serverVideoId}?autoplay=0&rel=0`);
      setTopic(externalTopic || '');
    } else if (externalTopic) {
      setTopic(externalTopic);
      handleSearch(externalTopic);
    }
  }, [externalTopic, serverVideoId]);

  // Load saved notes
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${topic || 'general'}_${mode}`);
    if (savedNotes) setNotes(savedNotes);
  }, [topic, mode]);

  // Auto-save
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (notes) {
        localStorage.setItem(`notes_${topic || 'general'}_${mode}`, notes);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000); 
      }
    }, 1000); 
    return () => clearTimeout(delayDebounceFn);
  }, [notes, topic, mode]);

  const handleSearch = (searchTerm) => {
    const searchTopic = searchTerm || topic;
    if (!searchTopic || !searchTopic.trim()) return;

    setIsLoading(true);
    let suffix = 'educational lecture explanation';
    if (isKids) suffix = 'animated educational story';
    if (isAdult) suffix = 'professional technical briefing documentary';
    if (isADHD) suffix = 'high focus educational breakdown fast paced';

    const query = encodeURIComponent(`${searchTopic.trim()} ${suffix}`);
    const finalUrl = `https://www.youtube.com/embed?listType=search&list=${query}&autoplay=0&rel=0`;

    setTimeout(() => {
      setVideoUrl(finalUrl);
      setIsLoading(false);
    }, 800);
  };

  const getTheme = () => {
    if (isKids) return kidsStyles;
    if (isAdult) return adultThemeStyles;
    if (isADHD) return adhdThemeStyles;
    return studentStyles;
  };

  const currentStyles = getTheme();

  return (
    <div style={currentStyles.page}>
      {/* Search Header */}
      <div style={currentStyles.card}>
        <h2 style={currentStyles.title}>
           {isKids ? '📖 Your Fun Story' : (isAdult ? '📚 Professional Study Video' : (isADHD ? '🚀 High-Focus Dashboard' : '🎓 Supplemental Learning'))}
        </h2>
        <p style={currentStyles.subtitle}>
           {isKids ? 'Easy to read and full of surprises!' : (isAdult ? 'High-signal technical briefings and in-depth analysis.' : (isADHD ? 'Minimized distractions for maximum cognitive engagement.' : 'Focused video lectures and conceptual deep-dives.'))}
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={currentStyles.searchForm}>
          <input 
            style={currentStyles.input} 
            placeholder={isKids ? "What story should we find today?" : "Quickly search for a focus topic..."} 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button type="submit" style={currentStyles.button}>
            {isLoading ? '🪄 Finding...' : (isKids ? '✨ Fetch Story' : 'Refetch Video')}
          </button>
        </form>
      </div>

      {videoUrl && (
        <div style={currentStyles.contentLayout}>
          {/* Left Block: Video Section */}
          <div style={currentStyles.videoBlock}>
            <div style={currentStyles.videoHeader}>📺 {isKids ? 'Story Time' : 'Deep Focus Area'}: {topic}</div>
            <div style={currentStyles.videoWrapper}>
              <iframe 
                src={videoUrl} 
                style={currentStyles.iframe} 
                title="Learning Video" 
                allowFullScreen 
              />
            </div>
          </div>

          {/* Right Block: Notes Section */}
          <div style={currentStyles.notesBlock}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={currentStyles.notesTitle}>📝 {isKids ? 'My Story Discoveries' : 'Hyper-Focus Journal'}</h3>
              {isSaved && <span style={currentStyles.saveBadge}>✓ Saved</span>}
            </div>
            <textarea 
              style={currentStyles.textarea} 
              placeholder={isKids ? "What surprises did you find?" : "Log key takeaways and immediate conceptual triggers..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const commonStyles = {
  iframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
  videoWrapper: { position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '20px', overflow: 'hidden', backgroundColor: '#000' },
};

const kidsStyles = {
  ...commonStyles,
  page: { width: '100%', paddingBottom: '40px', fontFamily: '"Comic Sans MS", cursive' },
  card: { maxWidth: '800px', margin: '0 auto 30px', backgroundColor: '#fff', padding: '30px', borderRadius: '30px', border: '4px solid #8b5cf6', textAlign: 'center' },
  title: { fontSize: '2.5rem', color: '#4c1d95', margin: '0' },
  subtitle: { color: '#64748b', marginBottom: '20px' },
  searchForm: { display: 'flex', gap: '10px', justifyContent: 'center' },
  input: { padding: '15px 25px', width: '60%', borderRadius: '50px', border: '2px solid #ddd', outline: 'none', fontSize: '1rem' },
  button: { padding: '15px 30px', borderRadius: '50px', border: 'none', backgroundColor: '#8b5cf6', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  contentLayout: { maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' },
  videoBlock: { backgroundColor: '#fff', borderRadius: '30px', border: '4px solid #8b5cf6', overflow: 'hidden', padding: '10px' },
  videoHeader: { padding: '10px', fontWeight: 'bold', color: '#8b5cf6', textAlign: 'center' },
  notesBlock: { backgroundColor: '#8b5cf6', borderRadius: '30px', padding: '30px', color: '#fff' },
  notesTitle: { margin: 0, color: '#fff' },
  textarea: { width: '100%', height: '200px', borderRadius: '20px', padding: '20px', fontSize: '1.1rem', border: 'none', outline: 'none' },
};

const studentStyles = {
  ...commonStyles,
  page: { width: '100%', paddingBottom: '40px', fontFamily: '"Inter", "system-ui", sans-serif' },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.4)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '2.2rem', color: '#fff', margin: '0', fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginBottom: '25px' },
  searchForm: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' },
  input: { padding: '15px 25px', width: '60%', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem', outline: 'none' },
  button: { padding: '15px 35px', borderRadius: '50px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' },
  contentLayout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '25px', alignItems: 'start' },
  videoBlock: { backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', padding: '15px', overflow: 'hidden' },
  videoHeader: { paddingBottom: '15px', color: '#3b82f6', fontWeight: 'bold', fontSize: '1.2rem' },
  notesBlock: { backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '25px', minHeight: '400px', display: 'flex', flexDirection: 'column' },
  notesTitle: { margin: 0, fontSize: '1.3rem', color: '#fff' },
  saveBadge: { fontSize: '0.8rem', backgroundColor: '#10b981', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' },
  textarea: { flex: 1, marginTop: '15px', width: '100%', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', fontSize: '1.1rem', backgroundColor: 'rgba(0,0,0,0.2)', color: '#e2e8f0', outline: 'none', resize: 'none' },
};

const adultThemeStyles = {
  ...studentStyles,
  card: { ...studentStyles.card, borderLeft: '8px solid #64748b' },
  videoHeader: { ...studentStyles.videoHeader, color: '#94a3b8' },
  button: { ...studentStyles.button, backgroundColor: '#64748b', boxShadow: '0 4px 15px rgba(100, 116, 139, 0.3)' },
};

const adhdThemeStyles = {
  ...studentStyles,
  card: { ...studentStyles.card, borderLeft: '8px solid #f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.05)' },
  videoHeader: { ...studentStyles.videoHeader, color: '#f59e0b' },
  button: { ...studentStyles.button, backgroundColor: '#f59e0b', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' },
  notesBlock: { ...studentStyles.notesBlock, border: '1px solid rgba(245, 158, 11, 0.3)' },
};

export default VideoLearningSection;
