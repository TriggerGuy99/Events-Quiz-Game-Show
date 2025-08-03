// Clean up duplicate questions and ensure optimal setup
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore';

// Firebase configuration
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

async function cleanupAndOptimize() {
  console.log('🧹 Cleaning up database for final version...\n');

  try {
    // Clear existing questions
    console.log('1️⃣ Removing duplicate questions...');
    const questionsSnapshot = await getDocs(collection(db, 'liveGameQuestions'));
    
    for (const docSnapshot of questionsSnapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }
    console.log(`✅ Removed ${questionsSnapshot.size} old questions`);

    // Add fresh set of optimized questions
    console.log('\n2️⃣ Adding optimized question set...');
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
          { text: "React", points: 40 },
          { text: "Vue.js", points: 25 },
          { text: "Angular", points: 20 },
          { text: "Svelte", points: 10 },
          { text: "jQuery", points: 5 }
        ],
        createdAt: new Date()
      },
      {
        id: 6,
        question: "Name a version control system",
        answers: [
          { text: "Git", points: 50 },
          { text: "SVN", points: 20 },
          { text: "Mercurial", points: 15 },
          { text: "Perforce", points: 10 },
          { text: "Bazaar", points: 5 }
        ],
        createdAt: new Date()
      }
    ];

    for (const question of questions) {
      await addDoc(collection(db, 'liveGameQuestions'), question);
    }
    console.log(`✅ Added ${questions.length} optimized questions`);

    // Reset app state for fresh start
    console.log('\n3️⃣ Resetting app state for final version...');
    await setDoc(doc(db, 'config', 'appState'), {
      currentPhase: 'waiting',
      presenterScreenView: 'welcome',
      activeQuestionId: null,
      revealedAnswers: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
      version: 'final-1.0'
    });
    console.log('✅ App state reset for final version');

    console.log('\n🎉 Database optimized and ready for final contestants!');
    console.log('\n📊 Final Setup:');
    console.log(`   • ${questions.length} tech-focused questions loaded`);
    console.log('   • App state reset to waiting phase');
    console.log('   • Database version: final-1.0');
    console.log('\n🚀 Ready for event deployment!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupAndOptimize().catch(console.error);
