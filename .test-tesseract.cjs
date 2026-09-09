const { createWorker } = require('tesseract.js');

async function testOCR(lang) {
  try {
    console.log(`Testing language: ${lang}`);
    const worker = await createWorker(lang, 1, {
      logger: m => {
        if (m.status === 'recognizing text' && m.progress > 0 && m.progress < 0.1) {
          console.log(`[${lang}] Progress:`, m.progress);
        }
      }
    });
    
    // Create a dummy image buffer (small 10x10 black image)
    const dummyImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv//v3/jx3DgKqJ1DwkGw1VTD2jAAAAAP//y1i/4gAAAABJRU5ErkJggg==', 'base64');
    
    const { data: { text } } = await worker.recognize(dummyImage);
    console.log(`[${lang}] Result:`, text.trim() === '' ? '(empty text)' : text);
    await worker.terminate();
    console.log(`[${lang}] Worker terminated successfully.`);
  } catch (err) {
    console.error(`[${lang}] Error:`, err);
  }
}

async function run() {
  await testOCR('eng');
  await testOCR('hin');
  await testOCR('ben');
}

run();
