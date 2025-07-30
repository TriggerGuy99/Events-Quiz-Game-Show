import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const PresenterView = () => {
  const [appState, setAppState] = useState({
    currentPhase: 'waiting',
    presenterScreenView: 'welcome',
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
    });

    // Fetch finalists
    const fetchFinalists = async () => {
      const usersQuery = query(collection(db, 'users'), orderBy('quizScore', 'desc'));
      const snapshot = await getDocs(usersQuery);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFinalists(usersData.slice(0, 10));
    };

    fetchFinalists();
    const interval = setInterval(fetchFinalists, 3000);

    return () => {
      unsubscribeAppState();
      clearInterval(interval);
    };
  }, []);

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-12">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-8">
            <span className="text-6xl">🎯</span>
          </div>
          <h1 className="text-8xl font-bold text-white mb-4">
            <span className="text-primary-400">Blackbox AI</span>
          </h1>
          <h2 className="text-5xl font-semibold text-primary-300 mb-4">
            Mavericks Club
          </h2>
          <h3 className="text-6xl text-white font-bold">
            Presents: <span className="text-primary-400">Tech Feud</span>
          </h3>
        </div>
        <div className="text-2xl text-gray-300">
          Welcome to the ultimate tech knowledge showdown!
        </div>
      </div>
    </div>
  );

  const QuizActiveScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-dark-800 to-green-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-12">
          <div className="w-32 h-32 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-8 pulse-animation">
            <span className="text-6xl">📝</span>
          </div>
          <h1 className="text-7xl font-bold text-white mb-6">
            Qualifier Quiz in Progress
          </h1>
          <div className="text-3xl text-green-400 mb-8">
            Contestants are competing for finalist spots!
          </div>
          <div className="text-xl text-gray-300">
            Top 10 scorers will advance to the live Tech Feud round
          </div>
        </div>
      </div>
    </div>
  );

  const LeaderboardScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">🏆 Leaderboard 🏆</h1>
          <div className="text-2xl text-primary-300">Qualifier Quiz Results</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {finalists.slice(0, 5).map((finalist, index) => (
              <div
                key={finalist.id}
                className={`leaderboard-entry p-4 rounded-lg ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-400' :
                  index === 1 ? 'bg-gradient-to-r from-gray-500 to-gray-400 border-gray-300' :
                  index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-500 border-orange-400' :
                  'bg-gradient-to-r from-primary-700 to-primary-600 border-primary-400'
                } border-l-4`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-white mr-4">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">
                        {finalist.email.split('@')[0]}
                      </div>
                      <div className="text-sm text-gray-200">
                        Quiz Score: {finalist.quizScore || 0}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {(finalist.quizScore || 0) + (finalist.gameScore || 0)}
                    </div>
                    <div className="text-sm text-gray-200">Total Points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            {finalists.slice(5, 10).map((finalist, index) => (
              <div
                key={finalist.id}
                className="leaderboard-entry p-4 rounded-lg bg-gradient-to-r from-primary-700 to-primary-600 border-l-4 border-primary-400"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-white mr-4">
                      #{index + 6}
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white">
                        {finalist.email.split('@')[0]}
                      </div>
                      <div className="text-sm text-gray-200">
                        Quiz Score: {finalist.quizScore || 0}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      {(finalist.quizScore || 0) + (finalist.gameScore || 0)}
                    </div>
                    <div className="text-sm text-gray-200">Total Points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const GameBoardScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-dark-800 to-primary-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-12">
          <h1 className="text-8xl font-bold text-white mb-6">
            🎮 <span className="text-primary-400">Tech Feud</span> 🎮
          </h1>
          <div className="text-3xl text-primary-300 mb-8">
            Live Game Round
          </div>
          <div className="text-xl text-gray-300">
            Waiting for question selection...
          </div>
        </div>
      </div>
    </div>
  );

  const QuestionDisplayScreen = () => {
    if (!currentQuestion) return <GameBoardScreen />;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-dark-800 to-primary-900 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Question */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">
              {currentQuestion.question}
            </h1>
          </div>

          {/* Answer Board */}
          <div className="game-board-grid max-w-4xl mx-auto">
            {currentQuestion.answers.map((answer, index) => (
              <div
                key={index}
                className={`answer-slot ${
                  appState.revealedAnswers?.includes(index) ? 'revealed' : ''
                }`}
              >
                {appState.revealedAnswers?.includes(index) ? (
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl">{answer.text}</span>
                    <span className="text-2xl font-bold">{answer.points}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-4xl font-bold">#{index + 1}</span>
                    <span className="text-2xl">???</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Leaderboard */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Current Standings</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {finalists.slice(0, 10).map((finalist, index) => (
                <div
                  key={finalist.id}
                  className="bg-dark-800 border border-primary-500 rounded-lg p-3 text-center"
                >
                  <div className="text-sm text-gray-400">#{index + 1}</div>
                  <div className="font-semibold text-white text-sm mb-1">
                    {finalist.email.split('@')[0]}
                  </div>
                  <div className="text-primary-400 font-bold">
                    {(finalist.quizScore || 0) + (finalist.gameScore || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render based on presenter screen view
  const renderScreen = () => {
    switch (appState.presenterScreenView) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'quiz-active':
        return <QuizActiveScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'game-board':
        return <GameBoardScreen />;
      case 'question-display':
        return <QuestionDisplayScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {renderScreen()}
    </div>
  );
};

export default PresenterView;
