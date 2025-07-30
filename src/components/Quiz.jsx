import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const quizQuestions = [
  {
    id: 1,
    question: "Which programming language is known as the 'mother of all languages'?",
    options: ["C", "Assembly", "FORTRAN", "COBOL"],
    correct: 0,
    points: 10
  },
  {
    id: 2,
    question: "What does 'HTTP' stand for?",
    options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transport Protocol", "Home Tool Transfer Protocol"],
    correct: 0,
    points: 10
  },
  {
    id: 3,
    question: "Which company developed the JavaScript programming language?",
    options: ["Microsoft", "Google", "Netscape", "Apple"],
    correct: 2,
    points: 15
  },
  {
    id: 4,
    question: "What is the maximum number of characters in a Tweet (as of 2023)?",
    options: ["140", "280", "320", "500"],
    correct: 1,
    points: 10
  },
  {
    id: 5,
    question: "Which AI model is developed by OpenAI?",
    options: ["BERT", "GPT", "T5", "PaLM"],
    correct: 1,
    points: 15
  },
  {
    id: 6,
    question: "What does 'IoT' stand for?",
    options: ["Internet of Things", "Input Output Technology", "Integrated Operations Technology", "Interactive Online Tools"],
    correct: 0,
    points: 10
  },
  {
    id: 7,
    question: "Which data structure follows LIFO (Last In First Out) principle?",
    options: ["Queue", "Array", "Stack", "Tree"],
    correct: 2,
    points: 15
  },
  {
    id: 8,
    question: "What is the latest version of HTML?",
    options: ["HTML4", "HTML5", "XHTML", "HTML6"],
    correct: 1,
    points: 10
  },
  {
    id: 9,
    question: "Which company owns GitHub?",
    options: ["Google", "Microsoft", "Amazon", "Meta"],
    correct: 1,
    points: 15
  },
  {
    id: 10,
    question: "What does 'API' stand for?",
    options: ["Application Programming Interface", "Advanced Programming Integration", "Automated Program Interface", "Application Process Integration"],
    correct: 0,
    points: 10
  }
];

const Quiz = () => {
  const [user] = useAuthState(auth);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [appState, setAppState] = useState({ currentPhase: 'waiting' });
  const navigate = useNavigate();

  // Listen to app state changes
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'appState'), (doc) => {
      if (doc.exists()) {
        const state = doc.data();
        setAppState(state);
        
        if (state.currentPhase === 'quiz' && !quizStarted) {
          setQuizStarted(true);
        } else if (state.currentPhase !== 'quiz' && quizStarted && !quizEnded) {
          handleQuizEnd();
        }
      }
    });

    return () => unsubscribe();
  }, [quizStarted, quizEnded]);

  // Timer logic
  useEffect(() => {
    if (!quizStarted || quizEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, quizStarted, quizEnded]);

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);

    // Calculate score
    const currentQ = quizQuestions[currentQuestion];
    if (answerIndex === currentQ.correct) {
      const timeBonus = Math.floor(timeLeft / 5); // Bonus points for speed
      const newScore = score + currentQ.points + timeBonus;
      setScore(newScore);
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      handleQuizEnd();
    }
  };

  const handleQuizEnd = async () => {
    setQuizEnded(true);
    
    // Save score to Firebase
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.email), {
          quizScore: score,
          quizCompletedAt: new Date()
        });

        // Add to quiz results collection
        await addDoc(collection(db, 'quizResults'), {
          email: user.email,
          score: score,
          completedAt: new Date(),
          answers: [] // Could store detailed answers if needed
        });
      } catch (error) {
        console.error('Error saving quiz results:', error);
      }
    }

    // Navigate to leaderboard after 3 seconds
    setTimeout(() => {
      navigate('/leaderboard');
    }, 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <div className="text-center">
          <div className="quiz-card border-2 border-red-400">
            <div className="w-16 h-16 mx-auto bg-red-500/20 border-2 border-red-400 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🚫</span>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4 font-mono tracking-wider">ACCESS DENIED</h2>
            <p className="text-cyan/70 font-mono mb-6">Authentication required to access assessment module.</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary px-6 py-3 rounded-lg"
            >
              <span className="font-mono tracking-widest">RETURN TO LOGIN</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="quiz-card border-2 border-yellow-400 scan-line">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 animate-glow">
              <span className="text-3xl">⏱️</span>
            </div>
            <h2 className="text-3xl font-bold cyber-title mb-4">ASSESSMENT PENDING</h2>
            <p className="text-cyan/70 font-mono mb-6 tracking-wider">
              Awaiting administrator authorization to begin qualifier assessment.
            </p>
            <div className="pulse-animation">
              <div className="inline-flex items-center px-6 py-3 bg-yellow-600/20 border border-yellow-400 rounded-full">
                <div className="cyber-spinner w-4 h-4 mr-3 border-yellow-400"></div>
                <span className="text-sm font-mono text-yellow-400 tracking-widest">STANDBY MODE ACTIVE...</span>
              </div>
            </div>
            
            {/* System Status */}
            <div className="mt-6 p-4 bg-dark-800/50 rounded-lg border border-cyan/30">
              <div className="text-cyan font-mono text-xs tracking-widest mb-2">SYSTEM STATUS</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="text-neon/70">NETWORK: ONLINE</div>
                <div className="text-purple/70">AUTH: VERIFIED</div>
                <div className="text-hot-pink/70">STATUS: READY</div>
                <div className="text-cyan/70">MODE: WAITING</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="min-h-screen cyber-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="quiz-card border-2 border-neon scan-line">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-neon to-cyan rounded-full flex items-center justify-center mb-6 animate-glow">
              <span className="text-4xl">�</span>
            </div>
            <h2 className="text-4xl font-bold cyber-title mb-4">ASSESSMENT COMPLETE</h2>
            <div className="mb-6">
              <div className="text-8xl font-black neon-text mb-2 font-mono">{score}</div>
              <p className="text-cyan/70 font-mono tracking-wider">TOTAL SCORE ACHIEVED</p>
            </div>
            <p className="text-white/90 font-mono mb-6 tracking-wide">
              Data processing complete. Transmitting results to leaderboard matrix.
            </p>
            
            {/* Processing Animation */}
            <div className="mb-6">
              <div className="cyber-spinner w-12 h-12 mx-auto mb-4"></div>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-cyan rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-neon rounded-full animate-ping delay-100"></div>
                <div className="w-2 h-2 bg-purple rounded-full animate-ping delay-200"></div>
                <div className="w-2 h-2 bg-hot-pink rounded-full animate-ping delay-300"></div>
              </div>
            </div>
            
            <p className="text-sm text-cyan/50 font-mono tracking-widest">REDIRECTING TO LEADERBOARD...</p>
            
            {/* Score Breakdown */}
            <div className="mt-6 p-4 bg-dark-800/50 rounded-lg border border-neon/30">
              <div className="text-neon font-mono text-xs tracking-widest mb-2">PERFORMANCE METRICS</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="text-cyan/70">QUESTIONS: {quizQuestions.length}</div>
                <div className="text-purple/70">ACCURACY: {Math.round((score / (quizQuestions.length * 15)) * 100)}%</div>
                <div className="text-hot-pink/70">RANKING: CALCULATING</div>
                <div className="text-neon/70">STATUS: PROCESSED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen cyber-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold cyber-title mb-4">TECH FEUD QUALIFIER</h1>
          <div className="flex items-center justify-center space-x-6 text-sm font-mono text-cyan/70">
            <span>QUESTION {currentQuestion + 1}/{quizQuestions.length}</span>
            <span className="text-purple">•</span>
            <span>SCORE: <span className="text-neon font-bold">{score}</span></span>
            <span className="text-purple">•</span>
            <span>OPERATOR: <span className="text-hot-pink">{user?.email}</span></span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-mono text-cyan/70 mb-2">
            <span>ASSESSMENT PROGRESS</span>
            <span>{Math.round(progress)}% COMPLETE</span>
          </div>
          <div className="bg-dark-700 rounded-full h-3 overflow-hidden border border-cyan/30">
            <div 
              className="bg-gradient-to-r from-cyan via-neon to-purple h-full transition-all duration-500 animate-glow"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center px-8 py-4 rounded-full border-2 font-mono text-2xl font-bold transition-all duration-300 ${
            timeLeft <= 10 
              ? 'bg-red-500/20 border-red-400 text-red-400 animate-pulse' 
              : 'bg-cyan/20 border-cyan text-cyan'
          }`}>
            <span className="mr-3">⏰</span>
            <span className="tracking-widest">{timeLeft}s</span>
          </div>
        </div>

        {/* Question */}
        <div className="quiz-card mb-8 border-2 border-cyan/50 scan-line">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-cyan to-neon text-black font-bold px-4 py-2 rounded-full text-lg mr-4">
              {String(currentQuestion + 1).padStart(2, '0')}
            </div>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wide">
              {currentQ.question}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`p-6 rounded-lg border-2 text-left font-mono transition-all duration-300 relative overflow-hidden ${
                  selectedAnswer === null 
                    ? 'border-cyan/30 bg-dark-800/50 hover:border-cyan hover:bg-dark-700/50 text-cyan/70 hover:text-cyan'
                    : selectedAnswer === index
                      ? index === currentQ.correct
                        ? 'border-neon bg-neon/20 text-neon font-bold animate-glow'
                        : 'border-red-400 bg-red-500/20 text-red-400 font-bold'
                      : index === currentQ.correct
                        ? 'border-neon bg-neon/20 text-neon font-bold animate-glow'
                        : 'border-cyan/20 bg-dark-800/30 text-cyan/40'
                }`}
              >
                <div className="flex items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mr-4 border-2 ${
                    selectedAnswer === null
                      ? 'bg-dark-700 border-cyan/50 text-cyan/70'
                      : selectedAnswer === index
                        ? index === currentQ.correct
                          ? 'bg-neon text-black border-neon'
                          : 'bg-red-500 text-white border-red-400'
                        : index === currentQ.correct
                          ? 'bg-neon text-black border-neon'
                          : 'bg-dark-700 border-cyan/30 text-cyan/40'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="tracking-wide">{option}</span>
                </div>
                
                {/* Hover effect */}
                {selectedAnswer === null && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className="mt-8 text-center">
              <div className={`inline-flex items-center px-6 py-3 rounded-full font-mono font-bold border-2 ${
                selectedAnswer === currentQ.correct 
                  ? 'bg-neon/20 border-neon text-neon' 
                  : 'bg-red-500/20 border-red-400 text-red-400'
              }`}>
                <span className="mr-3">
                  {selectedAnswer === currentQ.correct ? '✅' : '❌'}
                </span>
                <span className="tracking-widest">
                  {selectedAnswer === currentQ.correct ? 'CORRECT ANSWER' : 'INCORRECT ANSWER'}
                </span>
                <span className="ml-4 px-3 py-1 bg-black/50 rounded-full text-sm">
                  +{selectedAnswer === currentQ.correct ? currentQ.points + Math.floor(timeLeft / 5) : 0} PTS
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Question Info */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 text-sm font-mono text-cyan/50">
            <span>BASE POINTS: {currentQ.points}</span>
            <span>•</span>
            <span>SPEED BONUS: +{Math.floor(timeLeft / 5)}</span>
            <span>•</span>
            <span>NEXT: AUTO-ADVANCE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
