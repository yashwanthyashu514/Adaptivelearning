import React from "react";
import { Volume2, Inbox } from "lucide-react";

const OutputBox = ({ output, loading, mode, onSpeech }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Adapting content to {mode}...</p>
      </div>
    );
  }

  if (!output || output.length === 0) {
    return (
      <div className="output-box-empty">
        <Inbox size={48} strokeWidth={1.5} />
        <p>Enter source material and click "Generate Learning" to see adapted results.</p>
      </div>
    );
  }

  return (
    <div className="output-box-container">
      <div className="output-item-card full-block">
        <div className="output-content-block">
          {output.map((item, index) => {
            const isHighlight = item.startsWith('•') || item.startsWith('🔹') || item.startsWith('📍');
            return (
              <p 
                key={index} 
                style={{ 
                  marginBottom: '1rem', 
                  lineHeight: '1.6',
                  padding: isHighlight ? '10px 15px' : '0',
                  backgroundColor: isHighlight ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderRadius: isHighlight ? '8px' : '0',
                  borderLeft: isHighlight ? '3px solid #3b82f6' : 'none'
                }}
              >
                {item}
              </p>
            );
          })}
        </div>
        
        <div className="output-actions" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
          <span className="mode-badge">{mode}</span>
          {onSpeech && (
            <button 
              onClick={() => onSpeech(output.join(' '))} 
              className="speech-btn"
              title="Speak All Content"
            >
              <Volume2 size={16} />
              <span>Listen to Full Story</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputBox;