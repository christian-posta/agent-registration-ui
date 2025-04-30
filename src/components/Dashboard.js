// src/components/Dashboard.js
import React from 'react';
import { RefreshCw, Server, Database, Users, Wrench } from 'lucide-react';
import { TrendingUp } from '../icons/TrendingUp';

const Dashboard = ({ dashboardData, loading, error, refreshData }) => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-cyan-400 mr-2">
            <Database size={24} />
          </div>
          <h1 className="text-2xl font-semibold">System Overview</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs px-3 py-1 bg-cyan-900 text-cyan-400 rounded-full flex items-center">
            <span className="h-2 w-2 bg-cyan-400 rounded-full mr-2"></span>
            LIVE
          </div>
          <button className="text-gray-400 hover:text-white">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between mb-4">
            <h3 className="text-gray-400">Agents</h3>
            <div className="text-cyan-400">
              <Users size={20} />
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-4xl font-bold">{dashboardData.agents.count}</h2>
            <p className="text-gray-500">Active Agents Deployed</p>
          </div>
          <div className="text-yellow-400">
            <TrendingUp size={20} />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between mb-4">
            <h3 className="text-gray-400">MCP Servers</h3>
            <div className="text-purple-400">
              <Server size={20} />
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-4xl font-bold">{dashboardData.servers.count}</h2>
            <p className="text-gray-500">Online Servers</p>
          </div>
          <div className="text-blue-400">
            <TrendingUp size={20} />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between mb-4">
            <h3 className="text-gray-400">All Tools</h3>
            <div className="text-blue-400">
              <Wrench size={20} />
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-4xl font-bold">{dashboardData.tools.count}</h2>
            <p className="text-gray-500">Available Tools</p>
          </div>
          <div className="text-green-400">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>
      
      {/* Summary Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Resource Summary</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300">
              Daily
            </button>
            <button className="px-3 py-1 text-sm bg-cyan-900 text-cyan-400 rounded-md">
              Weekly
            </button>
            <button className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300">
              Monthly
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-gray-300">Total Resources</div>
            <div className="text-3xl font-bold text-cyan-400 mt-2">
              {dashboardData.agents.count + dashboardData.servers.count + dashboardData.tools.count}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-gray-300">Active Today</div>
            <div className="text-3xl font-bold text-green-400 mt-2">{dashboardData.agents.active}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-gray-300">Pending Tasks</div>
            <div className="text-3xl font-bold text-yellow-400 mt-2">{dashboardData.pendingTasks}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-gray-300">System Health</div>
            <div className="text-3xl font-bold text-green-400 mt-2">{dashboardData.systemHealth}%</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            className="flex items-center text-cyan-400 hover:text-cyan-300"
            onClick={refreshData}
          >
            <RefreshCw size={16} className="mr-2" />
            <span>Refresh Data</span>
          </button>
          <div className="text-right">
            <div className="text-sm text-gray-400">Last Updated</div>
            <div className="text-md font-medium text-gray-300">Just now</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;