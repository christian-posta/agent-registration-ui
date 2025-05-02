// src/App.js
import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, Shield, Users, Wrench, Home, Search, Bell, Moon } from 'lucide-react';

// Import API service
import API from './services/api';

// Import components
import Dashboard from './components/Dashboard';
import AgentsScreen from './components/AgentsScreen';
import ServersScreen from './components/ServersScreen';
import ToolsScreen from './components/ToolsScreen';

export default function NexusOS() {
  // State for dashboard data, loading, and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    agents: { count: 0, active: 0 },
    servers: { count: 0, online: 0 },
    tools: { count: 0, active: 0 },
    pendingTasks: 0,
    systemHealth: 0
  });
  
  // State to track the current active screen
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await API.fetchDashboardStats();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Function to refresh data manually
  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await API.fetchDashboardStats();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render the active screen based on state
  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard 
          dashboardData={dashboardData} 
          loading={loading} 
          error={error} 
          refreshData={refreshData} 
        />;
      case 'agents':
        return <AgentsScreen dashboardData={dashboardData} />;
      case 'servers':
        return <ServersScreen dashboardData={dashboardData} />;
      case 'tools':
        return <ToolsScreen dashboardData={dashboardData} />;
      default:
        return <Dashboard 
          dashboardData={dashboardData} 
          loading={loading} 
          error={error} 
          refreshData={refreshData} 
        />;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="text-cyan-400">
              <Shield size={28} />
            </div>
            <h1 className="text-2xl font-bold text-cyan-400">AI Agent Portal</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveScreen('dashboard')}
                className={`flex items-center p-3 rounded-md w-full text-left transition-colors ${activeScreen === 'dashboard' ? 'bg-gray-800 text-cyan-400' : 'hover:bg-gray-800'}`}
              >
                <Home className="mr-3" size={20} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveScreen('agents')}
                className={`flex items-center p-3 rounded-md w-full text-left transition-colors ${activeScreen === 'agents' ? 'bg-gray-800 text-cyan-400' : 'hover:bg-gray-800'}`}
              >
                <Users className="mr-3" size={20} />
                <span>Agents</span>
                <span className="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">{dashboardData.agents.count}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveScreen('servers')}
                className={`flex items-center p-3 rounded-md w-full text-left transition-colors ${activeScreen === 'servers' ? 'bg-gray-800 text-cyan-400' : 'hover:bg-gray-800'}`}
              >
                <Server className="mr-3" size={20} />
                <span>MCP Servers</span>
                <span className="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">{dashboardData.servers.count}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveScreen('tools')}
                className={`flex items-center p-3 rounded-md w-full text-left transition-colors ${activeScreen === 'tools' ? 'bg-gray-800 text-cyan-400' : 'hover:bg-gray-800'}`}
              >
                <Wrench className="mr-3" size={20} />
                <span>All Tools</span>
                <span className="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">{dashboardData.tools.count}</span>
              </button>
            </li>
          </ul>
        </nav>
        
        {/* System Status section removed */}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center h-full">
            <div className="flex items-center relative text-gray-400">
              <Search className="absolute left-3" size={18} />
              <input
                type="text"
                placeholder="Search systems..."
                className="bg-gray-800 border border-gray-700 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <Bell size={20} />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Moon size={20} />
            </button>
            <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-300">AB</span>
            </div>
          </div>
        </header>
        
        {/* Main Content Area - Dynamic based on active screen */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-cyan-400 animate-spin mr-2">
                <RefreshCw size={24} />
              </div>
              <p>Loading data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-md">
              {error}
            </div>
          ) : (
            renderActiveScreen()
          )}
        </main>
      </div>
    </div>
  );
}