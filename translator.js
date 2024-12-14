const axios = require('axios');

class Translator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://google-translator9.p.rapidapi.com/v2';
  }

  async translate(text, targetLang, sourceLang = 'auto') {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          q: text,
          target: targetLang,
          source: sourceLang,
          format: 'text'
        },
        {
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data && response.data.data && response.data.data.translations) {
        return response.data.data.translations[0].translatedText;
      } else {
        throw new Error('Unexpected response format from API');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || 'Unknown error occurred';
      console.error('Translation Error:', errorMsg);
      throw new Error(errorMsg);
    }
  }
}

module.exports = Translator;
