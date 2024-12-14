const Translator = require('./translator');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('Translator', () => {
  let mock;
  let translator;

  const apiKey = 'api-key';
  const apiUrl = 'https://google-translator9.p.rapidapi.com/v2';

  beforeEach(() => {
    mock = new MockAdapter(axios);
    translator = new Translator(apiKey);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should successfully translate text', async () => {
    const mockTranslation = 'Hola';
    const requestBody = {
      q: 'Hello',
      target: 'es',
      source: 'en',
      format: 'text',
    };

    mock.onPost(apiUrl, requestBody).reply(200, {
      data: {
        translations: [{ translatedText: mockTranslation }],
      },
    });

    const result = await translator.translate('Hello', 'es', 'en');

    // Assertions
    expect(result).toBe(mockTranslation);
    expect(mock.history.post.length).toBe(1); 
    expect(mock.history.post[0].headers['x-rapidapi-key']).toBe(apiKey);
  });

  it('should throw an error for an API error response', async () => {
    const errorMessage = 'Invalid API Key';

    mock.onPost(apiUrl).reply(401, {
      message: errorMessage,
    });

    await expect(translator.translate('Hello', 'es')).rejects.toThrow(errorMessage);
  });

  it('should throw an error for unexpected response format', async () => {
    mock.onPost(apiUrl).reply(200, {
      data: {},
    });

    await expect(translator.translate('Hello', 'es')).rejects.toThrow(
      'Unexpected response format from API'
    );
  });

  it('should handle network errors gracefully', async () => {
    mock.onPost(apiUrl).networkError();
    await expect(translator.translate('Hello', 'es')).rejects.toThrow('Network Error');
  });
});
