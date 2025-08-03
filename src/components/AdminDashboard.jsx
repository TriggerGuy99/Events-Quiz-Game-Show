import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, onSnapshot, collection, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { techFeudQuestions } from '../data/questions';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [gameState, setGameState] = useState({
    isQuizActive: false,
    currentQuestionId: null,
    showLeaderboard: false
  });
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');
    const currentTime = Date.now();
    
    if (!isAuthenticated || !loginTime || (currentTime - parseInt(loginTime)) > (2 * 60 * 60 * 1000)) {
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminLoginTime');
      navigate('/admin-login');
      return;
    }
    
    // Listen for participants
    const participantsQuery = query(collection(db, 'participants'), orderBy('score', 'desc'));
    const unsubscribeParticipants = onSnapshot(participantsQuery, (snapshot) => {
      const participantList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setParticipants(participantList);
    });

    // Listen for game state
    const unsubscribeGameState = onSnapshot(doc(db, 'config', 'gameState'), (doc) => {
      if (doc.exists()) {
        const state = doc.data();
        setGameState(state);
        setRevealedAnswers(state.revealedAnswers || []);
        if (state.currentQuestionId) {
          const question = techFeudQuestions.find(q => q.id === state.currentQuestionId);
          setActiveQuestion(question);
        }
      }
    });

    return () => {
      unsubscribeParticipants();
      unsubscribeGameState();
    };
  }, [navigate]);

  const handleStartQuestion = async (questionId) => {
    setLoading(true);
    try {
      const question = techFeudQuestions.find(q => q.id === questionId);
      const newGameState = {
        isQuizActive: true,
        currentQuestionId: questionId,
        showLeaderboard: false,
        revealedAnswers: []
      };
      
      await setDoc(doc(db, 'config', 'gameState'), newGameState);
      setActiveQuestion(question);
      setRevealedAnswers([]);
    } catch (error) {
      console.error('Error starting question:', error);
      alert('Failed to start question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevealAnswer = async (answerIndex) => {
    if (!activeQuestion) return;
    
    const newRevealedAnswers = [...revealedAnswers, answerIndex];
    setRevealedAnswers(newRevealedAnswers);
    
    const newGameState = {
      ...gameState,
      revealedAnswers: newRevealedAnswers
    };
    
    await setDoc(doc(db, 'config', 'gameState'), newGameState);
  };

  const handleAssignPoints = async (participantId, points) => {
    setLoading(true);
    try {
      const participantRef = doc(db, 'participants', participantId);
      const participant = participants.find(p => p.id === participantId);
      if (participant) {
        const newScore = (participant.score || 0) + points;
        await updateDoc(participantRef, { score: newScore });
      }
    } catch (error) {
      console.error('Error assigning points:', error);
      alert('Failed to assign points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowLeaderboard = async () => {
    const newGameState = {
      isQuizActive: false,
      currentQuestionId: null,
      showLeaderboard: true,
      revealedAnswers: []
    };
    
    await setDoc(doc(db, 'config', 'gameState'), newGameState);
    setActiveQuestion(null);
  };

  const handleResetGame = async () => {
    if (confirm('Are you sure you want to reset the entire game? This will clear all scores and reset the game state.')) {
      const newGameState = {
        isQuizActive: false,
        currentQuestionId: null,
        showLeaderboard: false,
        revealedAnswers: []
      };
      
      await setDoc(doc(db, 'config', 'gameState'), newGameState);
      setActiveQuestion(null);
      setRevealedAnswers([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">BlackBox AI Mavericks Club - Tech Feud</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Selection Panel */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Question Bank</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {techFeudQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    activeQuestion?.id === question.id
                      ? 'border-cyan-400 bg-cyan-400/20'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                  }`}
                  onClick={() => handleStartQuestion(question.id)}
                >
                  <div className="text-sm text-gray-400 mb-1">
                    {question.category} • {question.difficulty}
                  </div>
                  <div className="text-white font-medium">{question.question}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Control Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Game Controls</h2>
            
            {activeQuestion ? (
              <div className="space-y-4">
                <div className="bg-green-600/20 border border-green-400 rounded-lg p-4">
                  <div className="text-green-400 font-bold mb-2">Active Question</div>
                  <div className="text-white text-sm">{activeQuestion.question}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-white font-bold">Reveal Answers</div>
                  {activeQuestion.answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleRevealAnswer(index)}
                      disabled={revealedAnswers.includes(index)}
                      className={`w-full p-2 rounded text-left text-sm transition duration-300 ${
                        revealedAnswers.includes(index)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {answer.text} ({answer.points} pts)
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleShowLeaderboard}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300"
                >
                  Show Leaderboard
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No active question</div>
                <div className="text-sm text-gray-500">Select a question to start the game</div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/20">
              <button
                onClick={handleResetGame}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition duration-300"
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>

        {/* Participants Panel */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Participants ({participants.length})</h2>
            <div className="text-sm text-gray-400">
              Total participants registered
            </div>
          </div>

          {participants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-white font-bold">{participant.username}</div>
                      <div className="text-sm text-gray-400">{participant.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold text-lg">{participant.score || 0}</div>
                      <div className="text-xs text-gray-500">#{index + 1}</div>
                    </div>
                  </div>

                  {activeQuestion && (
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-gray-400 mb-2">Assign Points:</div>
                      <div className="grid grid-cols-2 gap-1">
                        {activeQuestion.answers.slice(0, 4).map((answer, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAssignPoints(participant.id, answer.points)}
                            disabled={loading}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition duration-300 disabled:opacity-50"
                          >
                            +{answer.points}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No participants yet. Waiting for players to join...
            </div>
          )}
        </div>

        {/* Quick Access Links */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/presenter"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
          >
            📺 Presenter View
          </a>
          <a
            href="/audience"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
          >
            👥 Audience View
          </a>
          <a
            href="/leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
          >
            🏆 Leaderboard
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
          >
            🚀 Join Page
          </a>
        </div>
      </div>
    </div>
  );
}
