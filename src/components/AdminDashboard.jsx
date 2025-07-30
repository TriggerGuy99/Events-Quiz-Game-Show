import React, { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot, collection, query, orderBy, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

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

const AdminDashboard = () => {
  const [appState, setAppState] = useState({
    currentPhase: 'waiting',
    presenterScreenView: 'welcome',
    activeQuestionId: null,
    revealedAnswers: [],
    leaderboard: []
  });
  const [users, setUsers] = useState([]);
  const [finalists, setFinalists] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple password protection
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password === 'admin2025') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Listen to app state and users
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribeAppState = onSnapshot(doc(db, 'config', 'appState'), (doc) => {
      if (doc.exists()) {
        setAppState(doc.data());
      }
    });

    const fetchUsers = async () => {
      const usersQuery = query(collection(db, 'users'), orderBy('quizScore', 'desc'));
      const snapshot = await getDocs(usersQuery);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      
      // Get top 10 as finalists
      const topUsers = usersData.slice(0, 10);
      setFinalists(topUsers);
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000); // Refresh every 5 seconds

    return () => {
      unsubscribeAppState();
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const updateAppState = async (updates) => {
    try {
      await setDoc(doc(db, 'config', 'appState'), {
        ...appState,
        ...updates
      }, { merge: true });
    } catch (error) {
      console.error('Error updating app state:', error);
    }
  };

  const startQuiz = () => {
    updateAppState({
      currentPhase: 'quiz',
      presenterScreenView: 'quiz-active'
    });
  };

  const endQuiz = () => {
    updateAppState({
      currentPhase: 'results',
      presenterScreenView: 'leaderboard'
    });
  };

  const startLiveGame = () => {
    updateAppState({
      currentPhase: 'liveGame',
      presenterScreenView: 'game-board',
      activeQuestionId: null,
      revealedAnswers: []
    });
  };

  const selectQuestion = (questionId) => {
    const question = liveGameQuestions.find(q => q.id === questionId);
    setCurrentQuestion(question);
    updateAppState({
      activeQuestionId: questionId,
      presenterScreenView: 'question-display',
      revealedAnswers: []
    });
  };

  const revealAnswer = (answerIndex) => {
    const newRevealed = [...(appState.revealedAnswers || []), answerIndex];
    updateAppState({
      revealedAnswers: newRevealed
    });
  };

  const awardPoints = async (finalistEmail, points) => {
    try {
      const finalistRef = doc(db, 'users', finalistEmail);
      const finalist = finalists.find(f => f.email === finalistEmail);
      if (finalist) {
        await updateDoc(finalistRef, {
          gameScore: (finalist.gameScore || 0) + points
        });
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const resetGame = () => {
    updateAppState({
      currentPhase: 'waiting',
      presenterScreenView: 'welcome',
      activeQuestionId: null,
      revealedAnswers: []
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <div className="quiz-card max-w-md w-full mx-4 border-2 border-red-400 scan-line">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-red-500/20 border-2 border-red-400 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold cyber-title">ADMIN ACCESS</h2>
            <p className="text-cyan/70 font-mono text-sm mt-2">Authorization required for system control</p>
          </div>
          
          <form onSubmit={handleAdminLogin}>
            <div className="mb-6">
              <label className="block text-cyan font-mono text-sm font-bold mb-2 tracking-wider">
                SECURITY PASSPHRASE
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800/50 border-2 border-red-400/30 rounded-lg 
                           text-white placeholder-red-400/50 font-mono tracking-wider
                           focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20
                           transition-all duration-300"
                  placeholder="enter.passphrase"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600/20 border-2 border-red-400 text-red-400 
                       font-mono font-bold py-3 px-4 rounded-lg tracking-widest
                       hover:bg-red-500/20 hover:text-red-300 hover:border-red-300
                       transition-all duration-300 transform hover:scale-105"
            >
              AUTHENTICATE
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-red-400/50 font-mono text-xs tracking-widest">
              UNAUTHORIZED ACCESS PROHIBITED
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold cyber-title mb-2">ADMIN CONTROL CENTER</h1>
            <p className="text-cyan/70 font-mono tracking-wider">Central command for Tech Feud operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-6 py-3 rounded-lg text-sm font-mono font-bold border-2 tracking-widest ${
              appState.currentPhase === 'waiting' ? 'bg-yellow-600/20 border-yellow-400 text-yellow-400' :
              appState.currentPhase === 'quiz' ? 'bg-neon/20 border-neon text-neon animate-glow' :
              appState.currentPhase === 'liveGame' ? 'bg-cyan/20 border-cyan text-cyan' :
              'bg-purple/20 border-purple text-purple'
            }`}>
              STATUS: {appState.currentPhase.toUpperCase()}
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-red-600/20 border-2 border-red-400 text-red-400 font-mono font-bold
                       rounded-lg hover:bg-red-500/20 hover:text-red-300 hover:border-red-300
                       transition-all duration-300 transform hover:scale-105 tracking-widest"
            >
              SYSTEM RESET
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="quiz-card border-2 border-cyan/50 scan-line">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-cyan rounded-full animate-pulse mr-3"></div>
                <h2 className="text-2xl font-bold neon-text font-mono tracking-wider">GAME CONTROLS</h2>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={startQuiz}
                  disabled={appState.currentPhase === 'quiz'}
                  className="w-full btn-primary py-3 px-4 rounded-lg font-mono tracking-widest
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transform transition-all duration-300 hover:scale-105"
                >
                  INITIATE QUALIFIER
                </button>
                
                <button
                  onClick={endQuiz}
                  disabled={appState.currentPhase !== 'quiz'}
                  className="w-full bg-orange-600/20 border-2 border-orange-400 text-orange-400 
                           font-mono font-bold py-3 px-4 rounded-lg tracking-widest
                           hover:bg-orange-500/20 hover:text-orange-300 hover:border-orange-300
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-105"
                >
                  TERMINATE QUALIFIER
                </button>
                
                <button
                  onClick={startLiveGame}
                  disabled={appState.currentPhase === 'liveGame'}
                  className="w-full bg-neon/20 border-2 border-neon text-neon 
                           font-mono font-bold py-3 px-4 rounded-lg tracking-widest
                           hover:bg-neon/30 hover:text-neon animate-glow
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                           transform hover:scale-105"
                >
                  ACTIVATE LIVE BATTLE
                </button>
              </div>

              {/* Question Selection */}
              {appState.currentPhase === 'liveGame' && (
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-purple rounded-full animate-pulse mr-2"></div>
                    <h3 className="text-lg font-bold matrix-text font-mono tracking-wider">QUESTION MATRIX</h3>
                  </div>
                  <div className="space-y-2">
                    {liveGameQuestions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => selectQuestion(q.id)}
                        className={`w-full text-left p-4 rounded-lg text-sm font-mono transition-all duration-300 border-2 ${
                          appState.activeQuestionId === q.id
                            ? 'bg-cyan/20 border-cyan text-cyan animate-glow'
                            : 'bg-dark-800/50 border-cyan/30 text-cyan/70 hover:border-cyan hover:bg-dark-700/50'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-cyan to-neon text-black font-bold rounded-full flex items-center justify-center text-xs mr-3">
                            {String(q.id).padStart(2, '0')}
                          </span>
                          <span className="tracking-wide">{q.question.substring(0, 35)}...</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Controls */}
              {currentQuestion && appState.currentPhase === 'liveGame' && (
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-hot-pink rounded-full animate-pulse mr-2"></div>
                    <h3 className="text-lg font-bold text-hot-pink font-mono tracking-wider">ANSWER REVEAL</h3>
                  </div>
                  <div className="space-y-2">
                    {currentQuestion.answers.map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => revealAnswer(index)}
                        disabled={appState.revealedAnswers?.includes(index)}
                        className="w-full text-left p-3 rounded-lg text-sm font-mono transition-all duration-300
                                 bg-dark-800/50 border-2 border-hot-pink/30 text-hot-pink/70
                                 hover:border-hot-pink hover:bg-dark-700/50 hover:text-hot-pink
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 disabled:bg-neon/20 disabled:border-neon disabled:text-neon"
                      >
                        <div className="flex justify-between items-center">
                          <span className="tracking-wide">{answer.text}</span>
                          <span className="px-2 py-1 bg-black/50 rounded-full text-xs font-bold">
                            {answer.points} PTS
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Participants & Finalists */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* All Participants */}
              <div className="quiz-card border-2 border-purple/50">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-purple rounded-full animate-pulse mr-3"></div>
                  <h2 className="text-xl font-bold text-purple font-mono tracking-wider">
                    ALL PARTICIPANTS ({users.length})
                  </h2>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user, index) => (
                    <div
                      key={user.id}
                      className="leaderboard-entry p-4 rounded-lg border border-purple/30"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-mono font-bold text-white tracking-wide">
                            <span className="text-purple">#{String(index + 1).padStart(2, '0')}</span> {user.email}
                          </div>
                          <div className="text-sm font-mono text-cyan/70 mt-1">
                            QUALIFIER: {user.quizScore || 0} | LIVE: {user.gameScore || 0}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold neon-text font-mono">
                            {(user.quizScore || 0) + (user.gameScore || 0)}
                          </div>
                          <div className="text-xs font-mono text-cyan/50 tracking-widest">TOTAL</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finalists */}
              <div className="quiz-card border-2 border-neon/50 scan-line">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-neon rounded-full animate-pulse mr-3"></div>
                  <h2 className="text-xl font-bold neon-text font-mono tracking-wider">
                    LIVE BATTLE FINALISTS (TOP 10)
                  </h2>
                </div>
                <div className="space-y-3">
                  {finalists.map((finalist, index) => (
                    <div
                      key={finalist.id}
                      className="p-4 rounded-lg border-2 border-neon/30 bg-gradient-to-r from-neon/10 to-cyan/10
                               hover:border-neon/50 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-mono font-bold text-white tracking-wide">
                            <span className="text-neon">#{String(index + 1).padStart(2, '0')}</span> {finalist.email}
                          </div>
                          <div className="text-sm font-mono text-cyan/70 mt-1">
                            QUALIFIER: {finalist.quizScore || 0} | LIVE: {finalist.gameScore || 0}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-neon font-mono">
                              {(finalist.quizScore || 0) + (finalist.gameScore || 0)}
                            </div>
                            <div className="text-xs font-mono text-cyan/50 tracking-widest">POINTS</div>
                          </div>
                          
                          {currentQuestion && (
                            <div className="flex flex-col space-y-1">
                              <div className="text-xs font-mono text-hot-pink/70 mb-1">AWARD</div>
                              <div className="flex space-x-1">
                                {currentQuestion.answers.map((answer, answerIndex) => (
                                  <button
                                    key={answerIndex}
                                    onClick={() => awardPoints(finalist.email, answer.points)}
                                    className="px-2 py-1 bg-hot-pink/20 border border-hot-pink text-hot-pink 
                                             text-xs rounded font-mono font-bold tracking-wider
                                             hover:bg-hot-pink/30 hover:border-hot-pink/70 
                                             transition-all duration-200 transform hover:scale-110"
                                    title={`Award ${answer.points} points for ${answer.text}`}
                                  >
                                    +{answer.points}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
