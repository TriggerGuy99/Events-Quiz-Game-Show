import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { techFeudQuestions } from '../data/questions';

const AudienceView = () => {
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
      console.log('🎮 Running in mock mode');
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

  return (
    <div className="min-h-screen cyber-bg p-2 sm:p-4">
      <div className="max-w-md mx-auto">
        {/* Header with Branding */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black holographic mb-2 font-['Orbitron'] tracking-wider">
            TECH FEUD
          </h1>
          <div className="h-1 w-16 sm:w-20 mx-auto bg-gradient-to-r from-cyan via-neon to-purple animate-pulse mb-3 shadow-lg shadow-cyan/50"></div>
          <p className="text-purple font-mono text-xs sm:text-sm tracking-wider mb-1">
            🚀 Blackbox AI Mavericks Club 🚀
          </p>
          <p className="text-cyan/80 font-mono text-xs tracking-wide">
            Audience View {localStorage.getItem('mockMode') === 'true' && '(Demo Mode)'}
          </p>
        </div>

        {/* Status Card */}
        <div className="quiz-card mb-4 sm:mb-6 border-2 border-cyan/50">
          <div className="text-center">
            <div className={`w-12 sm:w-16 h-12 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-3 sm:mb-4 ${
              gameState.isQuizActive ? 'bg-cyan/20 border-2 border-cyan' :
              gameState.showLeaderboard ? 'bg-neon/20 border-2 border-neon' :
              'bg-purple/20 border-2 border-purple'
            }`}>
              {gameState.isQuizActive && <span className="text-xl sm:text-2xl">🎮</span>}
              {gameState.showLeaderboard && <span className="text-xl sm:text-2xl">�</span>}
              {!gameState.isQuizActive && !gameState.showLeaderboard && <span className="text-xl sm:text-2xl">⏳</span>}
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              {gameState.isQuizActive && 'Tech Feud in Progress'}
              {gameState.showLeaderboard && 'Final Results'}
              {!gameState.isQuizActive && !gameState.showLeaderboard && 'Event Starting Soon'}
            </h2>
            
            <p className="text-gray-400 text-sm">
              {gameState.isQuizActive && 'Watch the live action on the main screen!'}
              {gameState.showLeaderboard && 'Congratulations to our winners!'}
              {!gameState.isQuizActive && !gameState.showLeaderboard && 'Please wait for the event to begin'}
            </p>
          </div>
        </div>

        {/* Current Question (if quiz is active) */}
        {gameState.isQuizActive && currentQuestion && (
          <div className="quiz-card mb-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              Current Question
            </h3>
            <div className="text-center mb-4">
              <span className="inline-block bg-cyan/20 text-cyan px-3 py-1 rounded text-sm font-mono">
                {currentQuestion.category}
              </span>
            </div>
            <p className="text-gray-300 mb-4 text-center text-lg">{currentQuestion.question}</p>
            
            <div className="space-y-2">
              {currentQuestion.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all duration-500 ${
                    gameState.revealedAnswers?.includes(index)
                      ? 'border-neon bg-neon/10 text-neon animate-pulse'
                      : 'border-gray-600 bg-dark-800/50 text-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono">
                      {gameState.revealedAnswers?.includes(index) 
                        ? `${index + 1}. ${answer.text}` 
                        : `${index + 1}. ???`
                      }
                    </span>
                    {gameState.revealedAnswers?.includes(index) && (
                      <span className="font-bold bg-neon/20 px-2 py-1 rounded text-neon">
                        {answer.points} pts
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="quiz-card">
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            {gameState.showLeaderboard ? 'Final Leaderboard' : 'Current Standings'}
          </h3>
          
          <div className="space-y-2">
            {participants.slice(0, 8).map((participant, index) => (
              <div
                key={participant.id}
                className={`p-3 rounded-lg flex justify-between items-center transition-all duration-300 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border border-gray-400/30' :
                  index === 2 ? 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border border-orange-500/30' :
                  'bg-dark-700/50 border border-gray-600/30'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {participant.name || participant.email?.split('@')[0] || 'Anonymous'}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {participant.email}
                    </div>
                  </div>
                </div>
                <div className="text-white font-bold text-lg">
                  {participant.score || 0}
                </div>
              </div>
            ))}
          </div>
          
          {participants.length === 0 && (
            <div className="text-center py-8">
              <span className="text-gray-400 text-sm">
                No participants yet. Join the quiz to see your name here!
              </span>
            </div>
          )}
          
          {participants.length > 8 && (
            <div className="text-center mt-4">
              <span className="text-gray-400 text-sm font-mono">
                ...and {participants.length - 8} more participants
              </span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm font-mono">
            👀 Keep your eyes on the main screen for the full experience!
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Updates automatically every few seconds
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-xs">
          <p className="font-mono">© 2025 Blackbox AI Mavericks Club</p>
          <p className="text-gray-700 mt-1">Tech Feud • Powered by Firebase</p>
        </div>
      </div>
    </div>
  );
};

export default AudienceView;
