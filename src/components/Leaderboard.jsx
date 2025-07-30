import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Leaderboard = () => {
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [appState, setAppState] = useState({ currentPhase: 'waiting' });
  const [userRank, setUserRank] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to users collection for real-time updates
    const usersQuery = query(collection(db, 'users'), orderBy('quizScore', 'desc'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      }));
      setUsers(usersData);

      // Find current user's rank
      if (user) {
        const currentUser = usersData.find(u => u.email === user.email);
        setUserRank(currentUser?.rank || null);
      }
    });

    // Listen to app state
    const unsubscribeAppState = onSnapshot(doc(db, 'config', 'appState'), (doc) => {
      if (doc.exists()) {
        const state = doc.data();
        setAppState(state);
        
        // Redirect based on app state changes
        if (state.currentPhase === 'liveGame') {
          // If user is in top 10, they're a finalist and should see audience view
          // Otherwise, redirect to audience view anyway
          setTimeout(() => {
            navigate('/audience');
          }, 5000);
        }
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeAppState();
    };
  }, [user, navigate]);

  const topFinalists = users.slice(0, 10);
  const isFinalist = user && topFinalists.some(f => f.email === user.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏆 <span className="text-primary-400">Tech Feud</span> Leaderboard 🏆
          </h1>
          <p className="text-gray-400">Qualifier Quiz Results</p>
          
          {/* User Status */}
          {user && (
            <div className="mt-6">
              <div className={`inline-flex items-center px-6 py-3 rounded-full ${
                isFinalist ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-gray-600 to-gray-500'
              } text-white font-semibold`}>
                {isFinalist ? (
                  <>
                    🎉 Congratulations! You're a finalist! (Rank #{userRank})
                  </>
                ) : (
                  <>
                    Your rank: #{userRank} - {userRank <= 15 ? 'So close!' : 'Better luck next time!'}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Finalists Section */}
        <div className="mb-12">
          <div className="quiz-card">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🌟 Finalists - Advancing to Live Game 🌟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {topFinalists.slice(0, 5).map((finalist, index) => (
                  <div
                    key={finalist.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 border-yellow-400' :
                      index === 1 ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-300' :
                      index === 2 ? 'bg-gradient-to-r from-orange-900 to-orange-800 border-orange-400' :
                      'bg-gradient-to-r from-primary-900 to-primary-800 border-primary-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-white mr-3">
                          #{index + 1}
                          {index === 0 && ' 👑'}
                          {index === 1 && ' 🥈'}
                          {index === 2 && ' 🥉'}
                        </div>
                        <div>
                          <div className={`font-semibold text-lg ${
                            user?.email === finalist.email ? 'text-green-300' : 'text-white'
                          }`}>
                            {finalist.email.split('@')[0]}
                            {user?.email === finalist.email && ' (You!)'}
                          </div>
                          <div className="text-sm text-gray-300">
                            Quiz Score: {finalist.quizScore || 0}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {finalist.quizScore || 0}
                        </div>
                        <div className="text-xs text-gray-300">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                {topFinalists.slice(5, 10).map((finalist, index) => (
                  <div
                    key={finalist.id}
                    className="p-4 rounded-lg bg-gradient-to-r from-primary-900 to-primary-800 border-l-4 border-primary-400"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-white mr-3">
                          #{index + 6}
                        </div>
                        <div>
                          <div className={`font-semibold text-lg ${
                            user?.email === finalist.email ? 'text-green-300' : 'text-white'
                          }`}>
                            {finalist.email.split('@')[0]}
                            {user?.email === finalist.email && ' (You!)'}
                          </div>
                          <div className="text-sm text-gray-300">
                            Quiz Score: {finalist.quizScore || 0}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {finalist.quizScore || 0}
                        </div>
                        <div className="text-xs text-gray-300">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* All Participants */}
        <div className="quiz-card">
          <h2 className="text-xl font-bold text-white mb-6">
            All Participants ({users.length})
          </h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((participant, index) => (
              <div
                key={participant.id}
                className={`p-3 rounded flex justify-between items-center ${
                  index < 10 
                    ? 'bg-gradient-to-r from-primary-800 to-primary-700' 
                    : 'bg-dark-700'
                } ${user?.email === participant.email ? 'ring-2 ring-green-400' : ''}`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center text-white font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className={`font-medium ${
                      user?.email === participant.email ? 'text-green-300' : 'text-white'
                    }`}>
                      {participant.email.split('@')[0]}
                      {user?.email === participant.email && ' (You)'}
                      {index < 10 && ' ⭐'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {participant.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">
                    {participant.quizScore || 0}
                  </div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          {appState.currentPhase === 'liveGame' ? (
            <div className="quiz-card">
              <h3 className="text-xl font-bold text-white mb-4">🎮 Live Game Starting!</h3>
              <p className="text-gray-300 mb-4">
                The live Tech Feud round is beginning. 
                {isFinalist ? ' You\'re a finalist!' : ' Watch the action unfold!'}
              </p>
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">Redirecting to audience view...</p>
            </div>
          ) : (
            <div className="text-gray-400">
              <p className="mb-2">🎯 Results are final!</p>
              <p className="text-sm">
                Finalists will compete in the live Tech Feud round on stage.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Blackbox AI Mavericks Club</p>
          <p className="mt-1">Thank you for participating in Tech Feud!</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
