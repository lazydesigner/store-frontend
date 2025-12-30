import React from 'react';
import { Trophy, TrendingUp, Award } from 'lucide-react';
import Card from '../common/Card';

const KittyLeaderboard = ({ sellers = [] }) => {
  const getMedalColor = (index) => {
    if (index === 0) return 'from-yellow-400 to-yellow-600';
    if (index === 1) return 'from-gray-300 to-gray-500';
    if (index === 2) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  const getMedalIcon = (index) => {
    if (index < 3) return Trophy;
    return Award;
  };

  return (
    <Card title="Top Sellers (Kitty Leaderboard)" subtitle="Based on this month's performance">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sellers.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p>No sales data available</p>
          </div>
        ) : (
          sellers.map((seller, index) => {
            const MedalIcon = getMedalIcon(index);
            
            return (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${
                  index === 0 ? 'from-yellow-50 to-yellow-100' :
                  index === 1 ? 'from-gray-50 to-gray-100' :
                  index === 2 ? 'from-orange-50 to-orange-100' :
                  'from-blue-50 to-blue-100'
                } rounded-lg p-6 relative overflow-hidden`}
              >
                {/* Rank Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getMedalColor(index)} flex items-center justify-center shadow-lg`}>
                                        <span className="text-white font-bold text-lg">#{seller.rank}</span>
                  </div>
                </div>

                {/* Medal Icon (Decorative) */}
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <MedalIcon className="h-32 w-32" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">{seller.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">Sales Representative</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Sales</span>
                      <span className="font-semibold text-gray-900">{seller.sales}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Orders</span>
                      <span className="font-semibold text-gray-900">{seller.orders}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                      <span className="text-sm text-gray-600 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Commission
                      </span>
                      <span className="font-bold text-green-600">{seller.commission}</span>
                    </div>
                  </div>

                  {/* Performance Badge */}
                  {index === 0 && (
                    <div className="mt-4 bg-yellow-600 text-white text-center py-1 px-2 rounded-full text-xs font-semibold">
                      🏆 Top Performer
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default KittyLeaderboard;