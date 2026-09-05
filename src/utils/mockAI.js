export const generateMockAIResponse = (question) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = question.toLowerCase();
      let response = "That's a wonderful question! Let's explore it together.";

      if (q.includes('rain') || q.includes('water cycle')) {
        response = "Rain happens when the sun heats up water in lakes and oceans, turning it into invisible vapor. This vapor floats up, gets cold, forms clouds, and then falls back down as rain!";
      } else if (q.includes('plant') || q.includes('eat') || q.includes('photosynthesis')) {
        response = "Plants make their own food! They use sunlight, water from the dirt, and air to cook up their meals. This amazing process is called photosynthesis.";
      } else if (q.includes('math') || q.includes('add') || q.includes('subtract')) {
        response = "Mathematics is like a puzzle! Adding means putting things together to get more, and subtracting means taking some away. Practice makes it super fun!";
      } else if (q.includes('animal') || q.includes('dog') || q.includes('cat')) {
        response = "Animals are amazing creatures! Some live in the wild like lions, and some are our friends at home like dogs and cats. They all need food, water, and care.";
      } else if (q.includes('space') || q.includes('star') || q.includes('moon')) {
        response = "Space is huge! The moon goes around the Earth, and the Earth goes around the Sun. Stars are giant balls of glowing gas very, very far away.";
      } else if (q.includes('hello') || q.includes('hi')) {
        response = "Hello there! I am BhashaSetu AI. What would you like to learn today?";
      }

      resolve(response);
    }, 1500); // 1.5 second simulated delay
  });
};
