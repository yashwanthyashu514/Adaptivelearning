import React from 'react';
import { Type, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

const TextInput = ({ value, onChange, placeholder, disabled, loading }) => {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      onChange(content);
    };
    reader.readAsText(file);
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="input-field-container">
      <div style={{ position: 'relative' }}>
        <textarea
          className="input-field"
          style={{ paddingRight: '50px' }}
          placeholder={placeholder || "Enter topic (e.g., Solar System)"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <button 
          onClick={triggerFileBrowser} 
          type="button"
          style={{ 
            position: 'absolute', 
            top: '15px', 
            right: '15px', 
            background: 'none', 
            border: 'none', 
            color: 'rgba(255,255,255,0.4)', 
            cursor: 'pointer',
            padding: '5px'
          }}
          title="Attach File (.txt)"
        >
          <Paperclip size={20} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".txt,.md,.json,.js" 
          onChange={handleFileChange} 
        />
      </div>
      <div className="input-stats">
        <span>{value.trim() ? value.trim().split(/\s+/).length : 0} words</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
};

export default TextInput;
