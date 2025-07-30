// Local Mock Mode for Testing Without Firebase
// Use this when you want to test the app without setting up Firebase

let mockAppState = {
  currentPhase: 'waiting', // 'waiting', 'quiz', 'game', 'results'
  activeUsers: 0,
  finalists: [],
  currentQuestion: null,
  leaderboard: []
};

let mockUsers = [];
let isLocalMode = false;

// Enable local mock mode
export const enableLocalMode = () => {
  isLocalMode = true;
  console.log('🔧 Local Mock Mode Enabled - No Firebase Required!');
};

// Mock Firebase Auth
export const mockAuth = {
  signInAnonymously: () => Promise.resolve({ user: { uid: 'mock-user-' + Date.now() } })
};

// Mock Firestore Functions
export const mockFirestore = {
  // Mock document reference
  doc: (db, collection, docId) => ({
    id: docId,
    collection,
    set: (data) => {
      console.log(`📝 Mock: Setting ${collection}/${docId}:`, data);
      if (collection === 'app' && docId === 'state') {
        mockAppState = { ...mockAppState, ...data };
      }
      return Promise.resolve();
    },
    get: () => {
      console.log(`📖 Mock: Getting ${collection}/${docId}`);
      if (collection === 'app' && docId === 'state') {
        return Promise.resolve({
          exists: () => true,
          data: () => mockAppState
        });
      }
      return Promise.resolve({
        exists: () => false,
        data: () => null
      });
    }
  }),

  // Mock collection reference
  collection: (db, collectionName) => ({
    add: (data) => {
      console.log(`➕ Mock: Adding to ${collectionName}:`, data);
      if (collectionName === 'users') {
        const mockUser = { id: 'user-' + Date.now(), ...data };
        mockUsers.push(mockUser);
        mockAppState.activeUsers = mockUsers.length;
      }
      return Promise.resolve({ id: 'mock-doc-' + Date.now() });
    },
    getDocs: () => {
      console.log(`📚 Mock: Getting ${collectionName} collection`);
      if (collectionName === 'users') {
        return Promise.resolve({
          docs: mockUsers.map(user => ({
            id: user.id,
            data: () => user
          }))
        });
      }
      return Promise.resolve({ docs: [] });
    }
  }),

  // Mock snapshot listener
  onSnapshot: (docRef, callback) => {
    console.log('👂 Mock: Setting up snapshot listener');
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (docRef.collection === 'app' && docRef.id === 'state') {
        callback({
          exists: () => true,
          data: () => mockAppState
        });
      }
    }, 1000);

    // Return unsubscribe function
    return () => {
      console.log('🔇 Mock: Unsubscribing snapshot listener');
      clearInterval(interval);
    };
  }
};

// Mock quiz data
export const mockQuizData = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Markup Language"],
    correct: 0
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correct: 2
  },
  {
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
    correct: 2
  }
];

// Mock game questions
export const mockGameQuestions = [
  {
    category: "Programming Languages",
    question: "Name a popular programming language",
    answers: [
      { text: "JavaScript", points: 40 },
      { text: "Python", points: 35 },
      { text: "Java", points: 30 },
      { text: "C++", points: 20 },
      { text: "PHP", points: 15 }
    ]
  },
  {
    category: "Web Technologies",
    question: "Name a frontend framework",
    answers: [
      { text: "React", points: 40 },
      { text: "Vue", points: 35 },
      { text: "Angular", points: 30 },
      { text: "Svelte", points: 20 },
      { text: "Ember", points: 15 }
    ]
  }
];

// Helper functions for local testing
export const mockHelpers = {
  // Start quiz simulation
  startQuiz: () => {
    mockAppState.currentPhase = 'quiz';
    console.log('🎯 Mock: Quiz started!');
  },

  // Add mock users
  addMockUsers: (count = 5) => {
    for (let i = 0; i < count; i++) {
      const mockUser = {
        id: `user-${i + 1}`,
        email: `user${i + 1}@test.com`,
        score: Math.floor(Math.random() * 100),
        isFinalist: false
      };
      mockUsers.push(mockUser);
    }
    mockAppState.activeUsers = mockUsers.length;
    console.log(`👥 Mock: Added ${count} test users`);
  },

  // Start game simulation
  startGame: () => {
    mockAppState.currentPhase = 'game';
    mockAppState.finalists = mockUsers.slice(0, 5).map(user => ({ ...user, isFinalist: true }));
    console.log('🎮 Mock: Game started with finalists!');
  },

  // Show current state
  showState: () => {
    console.log('📊 Mock State:', mockAppState);
    console.log('👥 Mock Users:', mockUsers);
  },

  // Reset everything
  reset: () => {
    mockAppState = {
      currentPhase: 'waiting',
      activeUsers: 0,
      finalists: [],
      currentQuestion: null,
      leaderboard: []
    };
    mockUsers = [];
    console.log('🔄 Mock: Everything reset!');
  }
};

// Auto-enable local mode if Firebase is not available
if (typeof window !== 'undefined') {
  window.mockMode = {
    enable: enableLocalMode,
    helpers: mockHelpers,
    auth: mockAuth,
    firestore: mockFirestore,
    quizData: mockQuizData,
    gameQuestions: mockGameQuestions
  };
  
  console.log('🔧 Mock mode available! Use window.mockMode.enable() to activate');
  console.log('🎮 Use window.mockMode.helpers for testing functions');
}
