export const mockLessons = [
  {
    id: 'l1',
    title: 'The Water Cycle',
    subject: 'Science',
    duration: '15 mins',
    language: 'English',
    description: 'Learn about how water moves around the Earth through evaporation, condensation, and precipitation.',
    content: `### What is the Water Cycle?\nThe water cycle is the continuous movement of water on, above, and below the surface of the Earth.\n\n### 1. Evaporation\nThe sun heats up water in rivers, lakes, and oceans. The water turns into an invisible gas called water vapor and rises into the air.\n\n### 2. Condensation\nAs the water vapor rises, it cools down. It changes back into tiny liquid water drops, forming clouds.\n\n### 3. Precipitation\nWhen the clouds get too heavy, the water falls back to Earth as rain, snow, or hail.\n\n### 4. Collection\nThe fallen water collects in oceans, lakes, and rivers, and the cycle starts all over again!`,
    progress: 0
  },
  {
    id: 'l2',
    title: 'जल चक्र (The Water Cycle)',
    subject: 'Science',
    duration: '15 mins',
    language: 'Hindi',
    description: 'वाष्पीकरण, संघनन और वर्षा के माध्यम से पृथ्वी के चारों ओर पानी कैसे घूमता है, इसके बारे में जानें।',
    content: `### जल चक्र क्या है?\nजल चक्र पृथ्वी की सतह पर, उसके ऊपर और नीचे पानी की निरंतर गति है।\n\n### 1. वाष्पीकरण (Evaporation)\nसूर्य नदियों, झीलों और महासागरों के पानी को गर्म करता है। पानी जल वाष्प नामक एक अदृश्य गैस में बदल जाता है और हवा में ऊपर उठता है।\n\n### 2. संघनन (Condensation)\nजैसे-जैसे जल वाष्प ऊपर उठता है, यह ठंडा होता है। यह वापस छोटी तरल पानी की बूंदों में बदल जाता है, जिससे बादल बनते हैं।\n\n### 3. वर्षा (Precipitation)\nजब बादल बहुत भारी हो जाते हैं, तो पानी बारिश, बर्फ या ओलावृष्टि के रूप में वापस पृथ्वी पर गिरता है।\n\n### 4. संग्रह (Collection)\nगिरा हुआ पानी महासागरों, झीलों और नदियों में इकट्ठा होता है, और चक्र फिर से शुरू होता है!`,
    progress: 100
  },
  {
    id: 'l3',
    title: 'Addition and Subtraction',
    subject: 'Mathematics',
    duration: '20 mins',
    language: 'English',
    description: 'Master the basics of adding and taking away numbers with fun examples.',
    content: `### What is Addition?\nAddition means putting things together to find the total.\n\n**Symbol:** + (Plus)\n**Example:** 2 apples + 3 apples = 5 apples. (2 + 3 = 5)\n\n### What is Subtraction?\nSubtraction means taking things away to see what is left.\n\n**Symbol:** - (Minus)\n**Example:** You have 5 candies. You eat 2. How many are left? 5 - 2 = 3 candies.\n\n### Practice Questions:\n1. 4 + 4 = ?\n2. 10 - 3 = ?\n3. 7 + 2 = ?`,
    progress: 45
  },
  {
    id: 'l4',
    title: 'Our Environment',
    subject: 'EVS',
    duration: '10 mins',
    language: 'English',
    description: 'Understand the world around us, plants, animals, and how to protect them.',
    content: `### What is our Environment?\nEverything around us is our environment. It includes living things like plants, animals, and humans, as well as non-living things like air, water, and soil.\n\n### Plants and Trees\nPlants are our green friends! They give us oxygen to breathe, food to eat, and shade on sunny days.\n\n### How to Protect Our Environment?\n1. **Do not litter:** Always throw garbage in a dustbin.\n2. **Save water:** Turn off the tap when brushing your teeth.\n3. **Plant a tree:** Trees make the air clean and fresh.\n4. **Recycle:** Reuse old paper and plastic instead of throwing them away.`,
    progress: 100
  },
  {
    id: 'l5',
    title: 'Basics of Grammar',
    subject: 'Language',
    duration: '25 mins',
    language: 'English',
    description: 'Learn about nouns, verbs, and how to build correct sentences.',
    content: `### What is a Noun?\nA noun is a naming word. It can be the name of a person, place, animal, or thing.\n**Examples:** Boy, School, Dog, Apple.\n\n### What is a Verb?\nA verb is an action word. It tells us what someone or something is doing.\n**Examples:** Run, Jump, Eat, Sleep.\n\n### Building a Sentence\nA complete sentence needs a Subject (Noun) and an Action (Verb).\n**Example:** The dog (Noun) barks (Verb).\n\n### Practice:\nIdentify the noun and verb in this sentence: "The cat sleeps."`,
    progress: 0
  }
];

export const mockBadges = [
  { id: 'b1', name: 'Curious Learner', description: 'Asked 10 questions to Ask AI.', icon: '★', unlocked: true, date: '2 Sep 2026', color: 'var(--color-primary)' },
  { id: 'b2', name: 'Language Explorer', description: 'Completed a lesson in a new language.', icon: '🛡️', unlocked: true, date: '1 Sep 2026', color: 'var(--color-success)' },
  { id: 'b3', name: 'Bright Mind', description: 'Scored 100% in 5 quizzes.', icon: '🌟', unlocked: false, color: 'var(--color-warning)' },
  { id: 'b4', name: 'Consistency King', description: 'Logged in for 7 days in a row.', icon: '👑', unlocked: false, color: 'var(--color-secondary)' }
];

export const mockNotifications = [
  { id: 'n1', title: 'New Lesson Available!', message: 'Your Science lesson is waiting!', read: false, time: '10 mins ago' },
  { id: 'n2', title: 'Badge Earned', message: 'You earned the Curious Learner badge!', read: true, time: '1 day ago' },
  { id: 'n3', title: 'Live Class Reminder', message: 'Mathematics live class starts in 30 minutes.', read: false, time: 'Just now' }
];

export const subjectsList = ['All', 'Science', 'Mathematics', 'EVS', 'Language'];
