// Database initialization script for Tech Feud
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

// Firebase configuration (same as in main app)
const firebaseConfig = {
  apiKey: "AIzaSyA7eokp25RnA0x-IHtJiJOulOQJElyBva4",
  authDomain: "act2-70730.firebaseapp.com",
  projectId: "act2-70730",
  storageBucket: "act2-70730.appspot.com",
  messagingSenderId: "614227992401",
  appId: "1:614227992401:web:c8c5da69e4731a6c243d70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize app state document
const initializeAppState = async () => {
  try {
    await setDoc(doc(db, 'config', 'appState'), {
      currentPhase: 'waiting', // 'waiting', 'quiz', 'results', 'liveGame'
      presenterScreenView: 'welcome', // 'welcome', 'quiz-active', 'leaderboard', 'game-board', 'question-display'
      activeQuestionId: null,
      revealedAnswers: [],
      createdAt: new Date(),
      lastUpdated: new Date()
    });
    console.log('App state initialized successfully');
  } catch (error) {
    console.error('Error initializing app state:', error);
  }
};

// Initialize live game questions
const initializeLiveGameQuestions = async () => {
  const questions = [
    {
      id: 1,
      question: "Name a popular programming language used for web development",
      answers: [
        { text: "JavaScript", points: 45 },
        { text: "Python", points: 25 },
        { text: "PHP", points: 15 },
        { text: "Java", points: 10 },
        { text: "TypeScript", points: 5 }
      ],
      createdAt: new Date()
    },
    {
      id: 2,
      question: "Name a major tech company founded in the 1970s",
      answers: [
        { text: "Apple", points: 40 },
        { text: "Microsoft", points: 35 },
        { text: "Oracle", points: 15 },
        { text: "Adobe", points: 8 },
        { text: "Intel", points: 2 }
      ],
      createdAt: new Date()
    },
    {
      id: 3,
      question: "Name a popular database management system",
      answers: [
        { text: "MySQL", points: 35 },
        { text: "PostgreSQL", points: 25 },
        { text: "MongoDB", points: 20 },
        { text: "SQLite", points: 12 },
        { text: "Redis", points: 8 }
      ],
      createdAt: new Date()
    },
    {
      id: 4,
      question: "Name a cloud computing platform",
      answers: [
        { text: "AWS", points: 45 },
        { text: "Google Cloud", points: 25 },
        { text: "Microsoft Azure", points: 20 },
        { text: "DigitalOcean", points: 7 },
        { text: "Heroku", points: 3 }
      ],
      createdAt: new Date()
    },
    {
      id: 5,
      question: "Name a popular frontend framework or library",
      answers: [
        { text: "React", points: 50 },
        { text: "Vue.js", points: 25 },
        { text: "Angular", points: 15 },
        { text: "Svelte", points: 7 },
        { text: "jQuery", points: 3 }
      ],
      createdAt: new Date()
    },
    {
      id: 6,
      question: "Name a version control system",
      answers: [
        { text: "Git", points: 60 },
        { text: "SVN", points: 20 },
        { text: "Mercurial", points: 10 },
        { text: "Perforce", points: 7 },
        { text: "Bazaar", points: 3 }
      ],
      createdAt: new Date()
    }
  ];

  try {
    for (const question of questions) {
      await addDoc(collection(db, 'liveGameQuestions'), question);
    }
    console.log('Live game questions initialized successfully');
  } catch (error) {
    console.error('Error initializing live game questions:', error);
  }
};

// Main initialization function
const initializeDatabase = async () => {
  console.log('Initializing Tech Feud database...');
  
  await initializeAppState();
  await initializeLiveGameQuestions();
  
  console.log('Database initialization complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run "npm run build" to build the application');
  console.log('2. Run "firebase deploy --only hosting:act2bamc" to deploy');
  console.log('3. Access admin dashboard at: https://act2bamc.web.app/admin');
  console.log('4. Admin password: admin2025');
};

// Run initialization
initializeDatabase().catch(console.error);
