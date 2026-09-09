import { withSupabase } from 'npm:@supabase/server@^1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    try {
      const body = await req.json();
      const { text, sourceLanguage, targetLanguage } = body;

      if (!text || typeof text !== 'string' || text.trim() === '') {
        return new Response(JSON.stringify({ error: 'Valid text is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // MyMemory has a 500 byte limit for the 'q' parameter.
      // String length check as a proxy, 500 characters max.
      if (text.length > 500) {
        return new Response(JSON.stringify({ error: 'Text too long (max 500 characters)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const supportedLangs = ['en', 'hi', 'bn'];
      if (!supportedLangs.includes(targetLanguage) || !supportedLangs.includes(sourceLanguage)) {
        return new Response(JSON.stringify({ error: 'Language not supported' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Format for MyMemory API: e.g., en|hi
      const langpair = `${sourceLanguage}|${targetLanguage}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`MyMemory API HTTP error: ${response.status}`);
      }

      const data = await response.json();
      
      // MyMemory returns rate limit and other errors inside responseStatus / responseDetails
      if (data.responseStatus !== 200) {
        throw new Error(data.responseDetails || 'MyMemory API returned an error status');
      }

      const translatedText = data.responseData?.translatedText;

      if (!translatedText) {
        throw new Error('Invalid response from translation service');
      }

      return new Response(JSON.stringify({ translatedText }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Translation function error:', error);
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  }),
};
