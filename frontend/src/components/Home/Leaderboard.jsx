import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'CodeMaster_2024', score: 2847, solved: 342, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { rank: 2, name: 'AlgoNinja', score: 2756, solved: 318, avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { rank: 3, name: 'ByteHunter', score: 2634, solved: 289, avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { rank: 4, name: 'StackOverflow', score: 2521, solved: 267, avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' },
  { rank: 5, name: 'CppGuru', score: 2445, solved: 251, avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' }
];

const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
  }
};

const Leaderboard = () => {
  return (
    <section className="py-20 bg-white dark:bg-black/30 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Global{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Leaderboard
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See where you rank among the world's best problem solvers
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.solved} problems solved
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-500">
                      {user.score.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      points
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg">
                View Full Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard