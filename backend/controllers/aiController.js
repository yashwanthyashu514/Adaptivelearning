const openai = require('../config/openai');
const { getYoutubeVideoId } = require('../services/youtubeService');

const transformText = async (req, res) => {
  const { text, mode } = req.body;

  if (!text || !mode) {
    return res.status(400).json({ error: 'Text and mode are required' });
  }

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let output = [];

  // MOCK ENGINE (If API Key is missing or invalid)
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key') || process.env.OPENAI_API_KEY.length < 20) {
    console.warn('OPENAI_API_KEY not found or invalid. Using Mock AI Engine.');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

    let subjectWord = text.trim();
    
    // Auto-correct common typos for Education Topics
    const lowerText = subjectWord.toLowerCase();
    if (lowerText.includes('alpah') || lowerText.includes('alfab') || lowerText.includes('alphab')) {
      subjectWord = 'Alphabet';
    } else if (lowerText.includes('photsy') || lowerText.includes('photosy')) {
      subjectWord = 'Photosynthesis';
    } else if (lowerText.includes('soler') || lowerText.includes('solar')) {
      subjectWord = 'Solar System';
    }
    
    // Fun mapping for Alphabets
    const alphabetMap = {
      'A': 'Apple 🍎', 'B': 'Butterfly 🦋', 'C': 'Cute Cat 🐱', 'D': 'Dancing Dinosaur 🦖',
      'E': 'Elephant 🐘', 'F': 'Friendly Fish 🐟', 'G': 'Green Grapes 🍇', 'H': 'Happy Hippo 🦛',
      'I': 'Ice Cream 🍦', 'J': 'Jumping Jellyfish 🪼', 'K': 'Kangaroo 🦘', 'L': 'Leaf 🍃',
      'M': 'Moon 🌙', 'N': 'Night Owl 🦉', 'O': 'Octopus 🐙', 'P': 'Penguin 🐧',
      'Q': 'Quokka 🐨', 'R': 'Rainbow 🌈', 'S': 'Stars ✨', 'T': 'Tiger 🐯',
      'U': 'Unicorn 🦄', 'V': 'Vegetables 🥦', 'W': 'Whale 🐋', 'X': 'Xylophone 🪘',
      'Y': 'Yellow Sun ☀️', 'Z': 'Zebra 🦓'
    };

    // For Kids Mode, if it's a single letter or short word, we treat it as an alphabet lesson
    if (mode === 'Kids Mode' && subjectWord.length <= 2) {
      const char = subjectWord[0].toUpperCase();
      subjectWord = alphabetMap[char] || `Alphabet ${char}`;
    } else if (mode === 'Kids Mode' && subjectWord.toLowerCase() === 'alphabet') {
      subjectWord = 'Alphabet ABC';
    } else {
      subjectWord = subjectWord.split(/\s+/).filter(w => w.length > 3)[0] || subjectWord.split(/\s+/)[0] || 'Discovery';
    }

    // Try to get a video ID for the subject
    const youtubeId = await getYoutubeVideoId(subjectWord);

    switch (mode) {
      case 'Kids Mode':
        output = [
          `✨ Welcome to the magical world of ${subjectWord}! 🌈`,
          `🚀 Imagine we are explorers discovering ${subjectWord} for the very first time!`,
          `🧸 It's all about fun and surprises! Isn't ${subjectWord} just wonderful? ✨`
        ];
        break;
      case 'Student Mode':
        output = [
          `📖 CONCEPT: The core nature of ${subjectWord}`,
          `📍 KEY POINT: Structured breakdown of the topic for detailed analysis.`,
          `🗺️ MAPPING: Focus on the relationship between ${subjectWord} and its environment.`
        ];
        break;
      case 'Adult Mode':
        output = [
          `📝 EXECUTIVE SUMMARY: Objective analysis of ${subjectWord}.`,
          `🔹 STRATEGIC TAKEAWAY: Implementing high-focus strategies for efficient comprehension.`,
          `📊 KEY METRICS: Clear, concise delivery of critical information points.`
        ];
        break;
      case 'Exam Prep Mode':
        output = [
          `🎯 EXAM FOCUS: Core conceptual boundaries of ${subjectWord}.`,
          `• PRACTICE QUESTION: Define the fundamental properties of ${subjectWord} and its impact on the environment.`,
          `• KEY TEKAWAY: Understanding the relationship between theory and practical instrumentation.`,
          `• HINT: Focus on the three distinct phases of ${subjectWord} during the initial synthesis.`
        ];
        break;
      case 'ADHD Mode':
        output = sentences.map(s => `🎯 FOCUS: ${s.trim()}`);
        break;
      default:
        output = sentences.map(s => s.trim());
    }
    return res.status(200).json({ output, subjectKeyword: subjectWord, youtubeId });
  }

  // REAL AI LOGIC
  let systemMessage;
  if (mode === 'Kids Mode') {
    systemMessage = `
    Explain the user's text for a 6-year-old kid. 
    Return JSON { "output": [string array], "subjectKeyword": "string" }
    Make it fun, magical, and cartoonish. Identify one main noun as subjectKeyword.`;
  } else if (mode === 'Student Mode') {
    systemMessage = `
    Analyze the text for a student. Provide a clear, structured visual breakdown.
    Return JSON { "output": [string array of structured points], "subjectKeyword": "string" }
    Identify one main technical concept as subjectKeyword.`;
  } else if (mode === 'Adult Mode') {
    systemMessage = `
    Analyze the text for an adult professional. Provide a formal, concise executive summary.
    Return JSON { "output": [string array of high-signal points], "subjectKeyword": "string" }
    Identify one main contextual concept as subjectKeyword.`;
  } else if (mode === 'Exam Prep Mode') {
    systemMessage = `
    Analyze the text for exam preparation. Provide structured highlights, potential questions, and key takeaways.
    Return JSON { "output": [string array of BULLTED highlights], "subjectKeyword": "string" }
    Make sure each item in the array is a clear, readable highlight starting with a bullet point (•).`;
  } else {
    systemMessage = `Adaptive learning assistant for mode: ${mode}. Return JSON { "output": [string array], "subjectKeyword": "string" }`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: text },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    const subject = parsed.subjectKeyword || 'Learning';
    const youtubeId = await getYoutubeVideoId(subject);

    return res.status(200).json({
      output: parsed.output,
      subjectKeyword: subject,
      youtubeId: youtubeId
    });

  } catch (error) {
    console.error('Error with OpenAI API:', error);

    // Fallback logic for all modes
    const subject = text.split(/\s+/).filter(w => w.length > 3)[0] || 'Learning';
    const youtubeId = await getYoutubeVideoId(subject);

    let fallbackOutput = [
      `Analysis of ${subject} completed successfully.`,
      `Synthesizing key conceptual boundaries for ${mode}.`,
      `Focusing on core takeaways for efficient learning.`
    ];

    if (mode === 'Exam Prep Mode') {
      fallbackOutput = [
        `🎓 EXAM HIGHLIGHTS: ${subject}`,
        `• EASY UNDERSTANDING: Think of ${subject} as the fundamental building block for this entire module. It works by organizing critical data into clear, accessible categories.`,
        `• KEY POINTS FOR EXAM: (1) Its formal definition (2) Its primary industrial application (3) Its relationship to other core systems.`,
        `• SCORING TIP: When writing an answer about ${subject}, always include a diagram or a flow-chart to secure maximum marks. ✨`
      ];
    }

    return res.status(200).json({
      output: fallbackOutput,
      subjectKeyword: subject,
      youtubeId: youtubeId,
      isMock: true
    });
  }

};

module.exports = { transformText };

