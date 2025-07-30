import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AudienceView = () => {
  const [appState, setAppState] = useState({
    currentPhase: 'waiting',
    activeQuestionId: null,
    revealedAnswers: []
  });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [finalists, setFinalists] = useState([]);

  const liveGameQuestions = [
    {
      id: 1,
      question: "Name a popular programming language used for web development",
      answers: [
        { text: "JavaScript", points: 45 },
        { text: "Python", points: 25 },
        { text: "PHP", points: 15 },
        { text: "Java", points: 10 },
        { text: "TypeScript", points: 5 }
      ]
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
      ]
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
      ]
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
      ]
    }
  ];

  useEffect(() => {
    // Check if we're in local mode
    const isLocalMode = localStorage.getItem('localMode') === 'true';
    
    if (isLocalMode) {
      // Use mock data for local testing
      console.log('🎮 Running in local demo mode');
      setAppState({
        currentPhase: 'waiting',
        activeQuestionId: null,
        revealedAnswers: []
      });
      
      // Add some mock finalists
      const mockFinalists = [
        { id: '1', email: 'alice@demo.com', quizScore: 85, gameScore: 45 },
        { id: '2', email: 'bob@demo.com', quizScore: 80, gameScore: 50 },
        { id: '3', email: 'charlie@demo.com', quizScore: 75, gameScore: 35 },
        { id: '4', email: 'diana@demo.com', quizScore: 70, gameScore: 40 },
        { id: '5', email: 'eve@demo.com', quizScore: 65, gameScore: 25 }
      ];
      setFinalists(mockFinalists);
      return;
    }

    try {
      // Listen to app state changes
      const unsubscribeAppState = onSnapshot(doc(db, 'config', 'appState'), (doc) => {
        if (doc.exists()) {
          const state = doc.data();
          setAppState(state);
          
          // Update current question when active question changes
          if (state.activeQuestionId) {
            const question = liveGameQuestions.find(q => q.id === state.activeQuestionId);
            setCurrentQuestion(question);
          }
        }
      }, (error) => {
        console.warn('Firebase connection failed, using local mode:', error);
        // Fallback to local demo mode
        localStorage.setItem('localMode', 'true');
        window.location.reload();
      });

      // Fetch finalists
      const fetchFinalists = async () => {
        try {
          const usersQuery = query(collection(db, 'users'), orderBy('quizScore', 'desc'));
          const snapshot = await getDocs(usersQuery);
          const usersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setFinalists(usersData.slice(0, 10));
        } catch (error) {
          console.warn('Failed to fetch finalists:', error);
          // Keep existing finalists or use empty array
        }
      };

      fetchFinalists();
      const interval = setInterval(fetchFinalists, 5000);

      return () => {
        unsubscribeAppState();
        clearInterval(interval);
      };
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      // Switch to local mode
      localStorage.setItem('localMode', 'true');
      window.location.reload();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-primary-400">Tech Feud</span>
          </h1>
          <p className="text-gray-400">
            Audience View {localStorage.getItem('localMode') === 'true' && '(Demo Mode)'}
          </p>
        </div>

        {/* Status Card */}
        <div className="quiz-card mb-6">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              appState.currentPhase === 'quiz' ? 'bg-green-600' :
              appState.currentPhase === 'liveGame' ? 'bg-blue-600' :
              'bg-yellow-600'
            }`}>
              {appState.currentPhase === 'quiz' && <span className="text-2xl">📝</span>}
              {appState.currentPhase === 'liveGame' && <span className="text-2xl">🎮</span>}
              {appState.currentPhase === 'waiting' && <span className="text-2xl">⏳</span>}
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              {appState.currentPhase === 'waiting' && 'Event Starting Soon'}
              {appState.currentPhase === 'quiz' && 'Quiz in Progress'}
              {appState.currentPhase === 'liveGame' && 'Live Game Round'}
            </h2>
            
            <p className="text-gray-400 text-sm">
              {appState.currentPhase === 'waiting' && 'Please wait for the event to begin'}
              {appState.currentPhase === 'quiz' && 'Contestants are competing for finalist spots'}
              {appState.currentPhase === 'liveGame' && 'Watch the main screen for the live action!'}
            </p>
          </div>
        </div>

        {/* Current Question (if live game is active) */}
        {appState.currentPhase === 'liveGame' && currentQuestion && (
          <div className="quiz-card mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Current Question</h3>
            <p className="text-gray-300 mb-4">{currentQuestion.question}</p>
            
            <div className="space-y-2">
              {currentQuestion.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${
                    appState.revealedAnswers?.includes(index)
                      ? 'border-green-500 bg-green-900/20 text-green-300'
                      : 'border-gray-600 bg-dark-800 text-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {appState.revealedAnswers?.includes(index) 
                        ? answer.text 
                        : `Answer ${index + 1}`
                      }
                    </span>
                    {appState.revealedAnswers?.includes(index) && (
                      <span className="font-bold">{answer.points} pts</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini Leaderboard */}
        <div className="quiz-card">
          <h3 className="text-lg font-bold text-white mb-4">
            {appState.currentPhase === 'liveGame' ? 'Current Standings' : 'Top Finalists'}
          </h3>
          
          <div className="space-y-2">
            {finalists.slice(0, 5).map((finalist, index) => (
              <div
                key={finalist.id}
                className={`p-3 rounded flex justify-between items-center ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' :
                  index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-400' :
                  index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-500' :
                  'bg-dark-700'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center text-white font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {finalist.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-gray-300">
                      Quiz: {finalist.quizScore || 0} | Game: {finalist.gameScore || 0}
                    </div>
                  </div>
                </div>
                <div className="text-white font-bold">
                  {(finalist.quizScore || 0) + (finalist.gameScore || 0)}
                </div>
              </div>
            ))}
          </div>
          
          {finalists.length > 5 && (
            <div className="text-center mt-4">
              <span className="text-gray-400 text-sm">
                ...and {finalists.length - 5} more finalists
              </span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            👀 Keep your eyes on the main screen for the full experience!
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-xs">
          <p>© 2025 Blackbox AI Mavericks Club</p>
        </div>
      </div>
    </div>
  );
};

export default AudienceView;
