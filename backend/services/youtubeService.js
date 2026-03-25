/**
 * Searches YouTube without an API key by fetching the search results page
 * and extracting the first video ID using regex.
 * Uses native fetch (available in Node.js 18+)
 */
const getYoutubeVideoId = async (query) => {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' educational')}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
        throw new Error(`YouTube search failed: ${response.statusText}`);
    }

    const html = await response.text();
    // Look for videoId patterns in the HTML
    // Pattern example: "videoRenderer":{"videoId":"XYZ"
    const regex = /"videoId":"([^"]+)"/;
    const match = html.match(regex);

    if (match && match[1]) {
      console.log(`Found YouTube Video ID for "${query}": ${match[1]}`);
      return match[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
};

module.exports = { getYoutubeVideoId };
