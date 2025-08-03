import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { techFeudQuestions } from '../data/questions';

const PresenterView = () => {
  const [gameState, setGameState] = useState({
    isQuizActive: false,
    currentQuestionId: null,
    showLeaderboard: false,
    revealedAnswers: []
  });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Check if we're in mock mode for local testing
    const isMockMode = localStorage.getItem('mockMode') === 'true';
    
    if (isMockMode) {
      console.log('🎮 Presenter running in mock mode');
      // Set mock data for testing
      setGameState({
        isQuizActive: true,
        currentQuestionId: 'cs_1',
        showLeaderboard: false,
        revealedAnswers: [0, 1]
      });
      setCurrentQuestion(techFeudQuestions[0]);
      setParticipants([
        { id: '1', name: 'Alice', email: 'alice@demo.com', score: 85 },
        { id: '2', name: 'Bob', email: 'bob@demo.com', score: 80 },
        { id: '3', name: 'Charlie', email: 'charlie@demo.com', score: 75 }
      ]);
      return;
    }

    // Listen for game state changes
    const unsubscribeGameState = onSnapshot(doc(db, 'config', 'gameState'), (doc) => {
      if (doc.exists()) {
        const state = doc.data();
        setGameState(state);
        
        if (state.currentQuestionId) {
          const question = techFeudQuestions.find(q => q.id === state.currentQuestionId);
          setCurrentQuestion(question);
        } else {
          setCurrentQuestion(null);
        }
      }
    }, (error) => {
      console.warn('Failed to connect to Firebase:', error);
      // Fallback to mock mode
      localStorage.setItem('mockMode', 'true');
      window.location.reload();
    });

    // Listen for participants (for leaderboard)
    const participantsQuery = query(collection(db, 'participants'), orderBy('score', 'desc'));
    const unsubscribeParticipants = onSnapshot(participantsQuery, (snapshot) => {
      const participantList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setParticipants(participantList);
    }, (error) => {
      console.warn('Failed to load participants:', error);
    });

    return () => {
      unsubscribeGameState();
      unsubscribeParticipants();
    };
  }, []);

  const WelcomeScreen = () => (
    <div className="min-h-screen cyber-bg flex items-center justify-center">
      <div className="text-center">
        <div className="mb-12">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan to-neon rounded-full flex items-center justify-center mb-8 shadow-lg shadow-cyan/50">
            <span className="text-6xl">🎯</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-black holographic mb-4 font-['Orbitron'] tracking-wider">
            TECH FEUD
          </h1>
          <h2 className="text-3xl sm:text-5xl font-semibold text-cyan mb-6 font-mono">
            🚀 Blackbox AI Mavericks Club 🚀
          </h2>
          <div className="h-2 w-32 mx-auto bg-gradient-to-r from-cyan via-neon to-purple animate-pulse mb-8 shadow-lg shadow-cyan/50"></div>
        </div>
        <div className="text-xl sm:text-2xl text-gray-300 font-mono">
          Welcome to the ultimate tech knowledge showdown!
        </div>
        <div className="mt-8 text-gray-400 font-mono text-sm">
          {localStorage.getItem('mockMode') === 'true' && '(Demo Mode)'}
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
    <div className="min-h-screen cyber-bg p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl font-black holographic mb-4 font-['Orbitron'] tracking-wider">
            🏆 FINAL LEADERBOARD 🏆
          </h1>
          <div className="text-lg sm:text-2xl text-cyan font-mono">Tech Feud Champions</div>
          <div className="h-2 w-32 mx-auto bg-gradient-to-r from-cyan via-neon to-purple animate-pulse mt-4 shadow-lg shadow-cyan/50"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4">
            {participants.slice(0, 5).map((participant, index) => (
              <div
                key={participant.id}
                className={`p-4 sm:p-6 rounded-lg border-l-4 transition-all duration-300 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-yellow-400' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-300' :
                  index === 2 ? 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-400' :
                  'bg-gradient-to-r from-cyan/10 to-neon/10 border-cyan'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`text-2xl sm:text-3xl font-bold mr-4 ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-orange-400' :
                      'text-cyan'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-semibold text-white">
                        {participant.name || participant.email?.split('@')[0] || 'Anonymous'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 font-mono">
                        {participant.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl sm:text-3xl font-bold ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-orange-400' :
                      'text-cyan'
                    }`}>
                      {participant.score || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            {participants.slice(5, 10).map((participant, index) => (
              <div
                key={participant.id}
                className="p-4 sm:p-6 rounded-lg bg-gradient-to-r from-dark-800/50 to-dark-700/50 border-l-4 border-gray-500"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-400 mr-4">
                      #{index + 6}
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-semibold text-white">
                        {participant.name || participant.email?.split('@')[0] || 'Anonymous'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300 font-mono">
                        {participant.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-300">
                      {participant.score || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Congratulations Message */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-gradient-to-r from-cyan/10 to-neon/10 border border-cyan/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-gray-300 text-lg font-mono">
              Thank you all for participating in Tech Feud!
            </p>
            <p className="text-gray-400 text-sm mt-2 font-mono">
              © 2025 Blackbox AI Mavericks Club
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const GameBoardScreen = () => (
    <div className="min-h-screen cyber-bg flex items-center justify-center">
      <div className="text-center">
        <div className="mb-12">
          <h1 className="text-6xl sm:text-8xl font-black holographic mb-6 font-['Orbitron'] tracking-wider">
            🎮 TECH FEUD 🎮
          </h1>
          <div className="text-2xl sm:text-3xl text-cyan mb-8 font-mono">
            Live Game Round
          </div>
          <div className="h-2 w-32 mx-auto bg-gradient-to-r from-cyan via-neon to-purple animate-pulse mb-8 shadow-lg shadow-cyan/50"></div>
          <div className="text-lg sm:text-xl text-gray-300 font-mono">
            {gameState.isQuizActive ? 'Game in Progress...' : 'Waiting for question selection...'}
          </div>
        </div>
      </div>
    </div>
  );

  const QuestionDisplayScreen = () => {
    if (!currentQuestion) return <GameBoardScreen />;

    return (
      <div className="min-h-screen cyber-bg p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Question Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="mb-4">
              <span className="inline-block bg-cyan/20 text-cyan px-4 py-2 rounded-lg text-lg font-mono border border-cyan/30">
                {currentQuestion.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 font-['Orbitron'] leading-tight">
              {currentQuestion.question}
            </h1>
          </div>

          {/* Answer Board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
            {currentQuestion.answers.map((answer, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-2 transition-all duration-500 ${
                  gameState.revealedAnswers?.includes(index) 
                    ? 'border-neon bg-neon/10 text-neon shadow-lg shadow-neon/30 animate-pulse' 
                    : 'border-gray-600 bg-dark-800/50 text-gray-400'
                }`}
              >
                {gameState.revealedAnswers?.includes(index) ? (
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg sm:text-xl font-mono">{answer.text}</span>
                    <span className="text-xl sm:text-2xl font-bold bg-neon/20 px-3 py-1 rounded text-neon">
                      {answer.points}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-2xl sm:text-4xl font-bold font-mono">#{index + 1}</span>
                    <span className="text-xl sm:text-2xl font-mono">???</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Leaderboard */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 font-['Orbitron']">
              Current Standings
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {participants.slice(0, 10).map((participant, index) => (
                <div
                  key={participant.id}
                  className={`rounded-lg p-3 text-center border transition-all duration-300 ${
                    index === 0 ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200' :
                    index === 1 ? 'bg-gray-400/20 border-gray-400/50 text-gray-200' :
                    index === 2 ? 'bg-orange-500/20 border-orange-500/50 text-orange-200' :
                    'bg-dark-800/70 border-gray-600/50 text-gray-300'
                  }`}
                >
                  <div className="text-xs font-mono text-gray-400">#{index + 1}</div>
                  <div className="font-semibold text-sm mb-1 truncate">
                    {participant.name || participant.email?.split('@')[0] || 'Anonymous'}
                  </div>
                  <div className="font-bold text-lg">
                    {participant.score || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render based on game state
  const renderScreen = () => {
    if (gameState.showLeaderboard) {
      return <LeaderboardScreen />;
    } else if (gameState.isQuizActive && currentQuestion) {
      return <QuestionDisplayScreen />;
    } else if (gameState.isQuizActive) {
      return <GameBoardScreen />;
    } else {
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
