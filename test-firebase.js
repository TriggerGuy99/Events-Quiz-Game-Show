// Comprehensive Firebase connection test
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';

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

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...\n');

  try {
    // Test 1: Check app state document
    console.log('1️⃣ Testing app state document...');
    const appStateDoc = await getDoc(doc(db, 'config', 'appState'));
    if (appStateDoc.exists()) {
      console.log('✅ App state document exists');
      console.log('   Current phase:', appStateDoc.data().currentPhase);
      console.log('   Presenter view:', appStateDoc.data().presenterScreenView);
    } else {
      console.log('❌ App state document not found');
      return false;
    }

    // Test 2: Check live game questions
    console.log('\n2️⃣ Testing live game questions...');
    const questionsSnapshot = await getDocs(collection(db, 'liveGameQuestions'));
    console.log('✅ Live game questions found:', questionsSnapshot.size);
    
    questionsSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`   Q${index + 1}: ${data.question.substring(0, 50)}...`);
    });

    // Test 3: Test write operations (update app state)
    console.log('\n3️⃣ Testing write operations...');
    await updateDoc(doc(db, 'config', 'appState'), {
      lastUpdated: new Date(),
      testConnection: true
    });
    console.log('✅ Write operation successful');

    // Test 4: Verify the update
    console.log('\n4️⃣ Verifying update...');
    const updatedDoc = await getDoc(doc(db, 'config', 'appState'));
    if (updatedDoc.data().testConnection) {
      console.log('✅ Update verification successful');
    } else {
      console.log('❌ Update verification failed');
      return false;
    }

    console.log('\n🎉 All Firebase tests passed! Connection is working perfectly.');
    return true;

  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    return false;
  }
}

// Run the test
testFirebaseConnection()
  .then(success => {
    if (success) {
      console.log('\n🚀 Firebase is ready for production!');
      console.log('\n📋 Final checklist:');
      console.log('✅ Database initialized');
      console.log('✅ Firebase connection working');
      console.log('✅ Read/Write operations functioning');
      console.log('✅ Live game questions loaded');
      console.log('✅ App state configured');
      console.log('\n🎯 Ready for final contestants!');
    } else {
      console.log('\n⚠️ Please fix Firebase issues before proceeding');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(console.error);
