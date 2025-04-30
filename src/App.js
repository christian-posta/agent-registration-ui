import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, Shield, Database, Users, Wrench, Home, Search, Bell, Moon } from 'lucide-react';
// No chart components needed

// Simulated API functions
// API for getting entity counts

// API service for fetching data
const API = {
  // Base API URL - would be configured based on environment in a real app
  baseUrl: 'https://api.nexuscontrol.com/v1',

  // Fetch all agents
  async fetchAgents() {
    try {
      // In a real implementation, this would be an actual fetch call
      // const response = await fetch(`${this.baseUrl}/agents`);
      // const data = await response.json();
      
      // Simulating API response with a delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        count: 147,
        active: 121,
        inactive: 26,
        data: Array(147).fill().map((_, i) => ({
          id: `agent-${i+1}`,
          name: `Agent ${i+1}`,
          status: Math.random() > 0.2 ? 'active' : 'inactive',
          lastSeen: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
          location: ['US-East', 'US-West', 'EU-Central', 'Asia-Pacific'][Math.floor(Math.random() * 4)]
        }))
      };
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  },

  // Fetch all MCP servers
  async fetchMCPServers() {
    try {
      // In a real implementation, this would be an actual fetch call
      // const response = await fetch(`${this.baseUrl}/servers`);
      // const data = await response.json();
      
      // Simulating API response with a delay
      await new Promise(resolve => setTimeout(resolve, 250));
      return {
        count: 28,
        online: 26,
        offline: 2,
        data: Array(28).fill().map((_, i) => ({
          id: `server-${i+1}`,
          name: `MCP-SRV-${i+1}`,
          status: Math.random() > 0.1 ? 'online' : 'offline',
          uptime: Math.floor(Math.random() * 30) + 1,
          region: ['US-East', 'US-West', 'EU-Central', 'Asia-Pacific'][Math.floor(Math.random() * 4)],
          load: Math.floor(Math.random() * 85) + 10
        }))
      };
    } catch (error) {
      console.error('Error fetching MCP servers:', error);
      throw error;
    }
  },

  // Fetch all tools
  async fetchTools() {
    try {
      // In a real implementation, this would be an actual fetch call
      // const response = await fetch(`${this.baseUrl}/tools`);
      // const data = await response.json();
      
      // Simulating API response with a delay
      await new Promise(resolve => setTimeout(resolve, 350));
      return {
        count: 94,
        active: 87,
        inactive: 7,
        data: Array(94).fill().map((_, i) => ({
          id: `tool-${i+1}`,
          name: `Tool ${i+1}`,
          type: ['Scanner', 'Analyzer', 'Modifier', 'Utility'][Math.floor(Math.random() * 4)],
          version: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
          lastUsed: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString()
        }))
      };
    } catch (error) {
      console.error('Error fetching tools:', error);
      throw error;
    }
  },

  // Fetch dashboard stats (combination of all entities)
  async fetchDashboardStats() {
    try {
      const [agents, servers, tools] = await Promise.all([
        this.fetchAgents(),
        this.fetchMCPServers(),
        this.fetchTools()
      ]);
      
      return {
        agents,
        servers,
        tools,
        pendingTasks: Math.floor(Math.random() * 20) + 30,
        systemHealth: Math.floor(Math.random() * 5) + 95
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

// Custom icons
const Cpu = ({ size }) => (
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="2" x2="9" y2="4"></line>
      <line x1="15" y1="2" x2="15" y2="4"></line>
      <line x1="9" y1="20" x2="9" y2="22"></line>
      <line x1="15" y1="20" x2="15" y2="22"></line>
      <line x1="20" y1="9" x2="22" y2="9"></line>
      <line x1="20" y1="14" x2="22" y2="14"></line>
      <line x1="2" y1="9" x2="4" y2="9"></line>
      <line x1="2" y1="14" x2="4" y2="14"></line>
    </svg>
  </div>
);

const Wifi = ({ size }) => (
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
      <line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
  </div>
);

const TrendingUp = ({ size }) => (
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  </div>
);

export default function NexusOS() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    agents: { count: 0, active: 0 },
    servers: { count: 0, online: 0 },
    tools: { count: 0, active: 0 },
    pendingTasks: 0,
    systemHealth: 0
  });
  
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
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="text-cyan-400">
              <Shield size={28} />
            </div>
            <h1 className="text-2xl font-bold text-cyan-400">NEXUS OS</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center p-3 rounded-md bg-gray-800 text-cyan-400">
                <Home className="mr-3" size={20} />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-800 transition-colors">
                <Users className="mr-3" size={20} />
                <span>Agents</span>
                <span className="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">{dashboardData.agents.count}</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-800 transition-colors">
                <Server className="mr-3" size={20} />
                <span>MCP Servers</span>
                <span className="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">{dashboardData.servers.count}</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-md hover:bg-gray-800 transition-colors">
                <Wrench className="mr-3" size={20} />
                <span>All Tools</span>
                <span className="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">{dashboardData.tools.count}</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <div className="space-y-4">
            <div>
              <h3 className="uppercase text-xs text-gray-500 font-semibold tracking-wider mb-2">SYSTEM STATUS</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Core Systems</span>
                    <span>81%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '81%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Security</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <div className="h-8 w-8 bg-white rounded-full"></div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
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
                onClick={async () => {
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
                }}
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
        </main>
      </div>
    </div>
  );
}