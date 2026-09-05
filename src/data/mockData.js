export const mockLessons = [
  {
    id: 'l1',
    title: 'The Water Cycle',
    subject: 'Science',
    duration: '15 mins',
    language: 'English',
    description: 'Learn about how water moves around the Earth through evaporation, condensation, and precipitation.',
    progress: 0
  },
  {
    id: 'l2',
    title: 'जल चक्र (The Water Cycle)',
    subject: 'Science',
    duration: '15 mins',
    language: 'Hindi',
    description: 'वाष्पीकरण, संघनन और वर्षा के माध्यम से पृथ्वी के चारों ओर पानी कैसे घूमता है, इसके बारे में जानें।',
    progress: 100
  },
  {
    id: 'l3',
    title: 'Addition and Subtraction',
    subject: 'Mathematics',
    duration: '20 mins',
    language: 'English',
    description: 'Master the basics of adding and taking away numbers with fun examples.',
    progress: 45
  },
  {
    id: 'l4',
    title: 'Our Environment',
    subject: 'EVS',
    duration: '10 mins',
    language: 'English',
    description: 'Understand the world around us, plants, animals, and how to protect them.',
    progress: 100
  },
  {
    id: 'l5',
    title: 'Basics of Grammar',
    subject: 'Language',
    duration: '25 mins',
    language: 'English',
    description: 'Learn about nouns, verbs, and how to build correct sentences.',
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
