import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, Shield, Database, Users, Wrench, Home, Search, Bell, Moon } from 'lucide-react';

// Simulated API service
const API = {
  baseUrl: 'https://api.nexuscontrol.com/v1',

  async fetchAgents() {
    try {
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

  async fetchMCPServers() {
    try {
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

  async fetchTools() {
    try {
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

// Dashboard Component
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

// Agents Screen Component with Table and Pagination
const AgentsScreen = ({ dashboardData }) => {
  // Sample agent data
  const agentData = [
    { id: 1, name: "financial-agent.acme.com", description: "An agent with finance skills", fingerprint: "9f:3a:2b:7e:1c:5d" },
    { id: 2, name: "sales-agent.acme.com", description: "Handles sales operations and tracking", fingerprint: "4e:8d:2c:6b:9a:3f" },
    { id: 3, name: "inventory-agent.acme.com", description: "Manages inventory and stock levels", fingerprint: "7b:2e:5d:1f:8c:4a" },
    { id: 4, name: "security-agent.acme.com", description: "Monitors network security threats", fingerprint: "2a:6c:9f:3d:5e:8b" },
    { id: 5, name: "analytics-agent.acme.com", description: "Processes data analytics jobs", fingerprint: "5f:1d:7c:3a:9b:2e" },
    { id: 6, name: "hr-agent.acme.com", description: "Manages HR inquiries and resources", fingerprint: "8c:4b:1a:7d:2e:6f" },
    { id: 7, name: "customer-agent.acme.com", description: "Handles customer service automation", fingerprint: "3d:9e:5b:2c:7a:1f" },
    { id: 8, name: "marketing-agent.acme.com", description: "Coordinates marketing campaigns", fingerprint: "6a:1f:8d:2b:5c:9e" },
    { id: 9, name: "logistics-agent.acme.com", description: "Optimizes logistics and shipping", fingerprint: "1b:7e:4c:9a:3d:5f" },
    { id: 10, name: "research-agent.acme.com", description: "Assists with R&D information gathering", fingerprint: "9c:2a:5f:8b:1d:7e" },
    { id: 11, name: "dev-agent.acme.com", description: "Supports development environments", fingerprint: "4f:8a:2d:6c:9b:3e" },
    { id: 12, name: "product-agent.acme.com", description: "Manages product information and updates", fingerprint: "7d:3b:5e:1a:8f:2c" },
    { id: 13, name: "payment-agent.acme.com", description: "Processes payment transactions", fingerprint: "2c:6d:9a:3f:5b:8e" },
    { id: 14, name: "legal-agent.acme.com", description: "Handles legal document processing", fingerprint: "5a:1c:7b:3e:9d:2f" },
    { id: 15, name: "support-agent.acme.com", description: "Provides technical support automation", fingerprint: "8b:4d:1c:7a:2f:6e" }
  ];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  // Calculate total pages
  const totalPages = Math.ceil(agentData.length / rowsPerPage);
  
  // Get current rows for the page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = agentData.slice(indexOfFirstRow, indexOfLastRow);
  
  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="text-cyan-400 mr-2">
          <Users size={24} />
        </div>
        <h1 className="text-2xl font-semibold">Agents Management</h1>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Agent Status Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Total Agents</div>
            <div className="text-3xl font-bold text-cyan-400">{dashboardData.agents.count}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Active Agents</div>
            <div className="text-3xl font-bold text-green-400">{dashboardData.agents.active}</div>
          </div>
        </div>
      </div>
      
      {/* Agent Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Agent Directory</h2>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Search agents..." 
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button className="bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded-md text-sm">
              Search
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Fingerprint</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentRows.map((agent) => (
                <tr key={agent.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 text-cyan-400">{agent.name}</td>
                  <td className="px-6 py-4">{agent.description}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-400">{agent.fingerprint}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Disable</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 bg-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, agentData.length)} of {agentData.length} agents
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === page ? 'bg-cyan-700 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Servers Screen Component with Table and Pagination
const ServersScreen = ({ dashboardData }) => {
  // Sample server data
  const serverData = [
    { id: 1, name: "mcp-east-01.datacenter.com", description: "Primary East region server", fingerprint: "5a:2c:8f:1d:7e:3b" },
    { id: 2, name: "mcp-east-02.datacenter.com", description: "Secondary East region server", fingerprint: "9b:4d:2e:6a:1f:8c" },
    { id: 3, name: "mcp-west-01.datacenter.com", description: "Primary West region server", fingerprint: "3c:7f:5a:9d:2e:6b" },
    { id: 4, name: "mcp-west-02.datacenter.com", description: "Secondary West region server", fingerprint: "8d:1e:6b:3a:9f:4c" },
    { id: 5, name: "mcp-central-01.datacenter.com", description: "Primary Central region server", fingerprint: "2f:7c:4a:1b:8e:5d" },
    { id: 6, name: "mcp-central-02.datacenter.com", description: "Secondary Central region server", fingerprint: "6a:3d:9f:2c:7b:4e" },
    { id: 7, name: "mcp-eu-01.datacenter.com", description: "Primary EU region server", fingerprint: "1d:8f:5b:2a:6c:9e" },
    { id: 8, name: "mcp-eu-02.datacenter.com", description: "Secondary EU region server", fingerprint: "7e:3a:9c:4f:1b:5d" },
    { id: 9, name: "mcp-asia-01.datacenter.com", description: "Primary Asia region server", fingerprint: "4b:9d:2f:7e:3c:8a" },
    { id: 10, name: "mcp-asia-02.datacenter.com", description: "Secondary Asia region server", fingerprint: "9c:5e:1d:8f:2a:7b" },
    { id: 11, name: "mcp-backup-01.datacenter.com", description: "Global backup and recovery server", fingerprint: "2d:6a:9c:3f:7b:4e" },
    { id: 12, name: "mcp-backup-02.datacenter.com", description: "Redundant backup server", fingerprint: "8f:3b:5d:1a:7c:2e" },
    { id: 13, name: "mcp-auth-01.datacenter.com", description: "Authentication and security server", fingerprint: "4c:9e:2d:7a:1f:6b" },
    { id: 14, name: "mcp-storage-01.datacenter.com", description: "Primary storage cluster", fingerprint: "7d:2f:8a:3c:9e:1b" },
    { id: 15, name: "mcp-analytics-01.datacenter.com", description: "Data analytics processing server", fingerprint: "1e:6c:3a:9f:5b:2d" }
  ];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  // Calculate total pages
  const totalPages = Math.ceil(serverData.length / rowsPerPage);
  
  // Get current rows for the page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = serverData.slice(indexOfFirstRow, indexOfLastRow);
  
  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="text-purple-400 mr-2">
          <Server size={24} />
        </div>
        <h1 className="text-2xl font-semibold">MCP Servers</h1>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Server Status Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Total Servers</div>
            <div className="text-3xl font-bold text-cyan-400">{dashboardData.servers.count}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Online Servers</div>
            <div className="text-3xl font-bold text-green-400">{dashboardData.servers.online}</div>
          </div>
        </div>
      </div>
      
      {/* Server Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Server Directory</h2>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Search servers..." 
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
              Search
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Fingerprint</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentRows.map((server) => (
                <tr key={server.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 text-purple-400">{server.name}</td>
                  <td className="px-6 py-4">{server.description}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-400">{server.fingerprint}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-purple-400 hover:text-purple-300 text-sm">Manage</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Reboot</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 bg-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, serverData.length)} of {serverData.length} servers
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === page ? 'bg-purple-700 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tools Screen Component with Table and Pagination
const ToolsScreen = ({ dashboardData }) => {
  // Sample tools data
  const toolsData = [
    { id: 1, name: "NetworkScanner", description: "Network vulnerability scanning tool", fingerprint: "3e:7a:9c:2b:5d:8f", mcpServer: "mcp-east-01.datacenter.com" },
    { id: 2, name: "DataAnalyzer", description: "Big data processing and analysis", fingerprint: "6f:1a:8e:3c:9b:2d", mcpServer: "mcp-analytics-01.datacenter.com" },
    { id: 3, name: "SecurityAudit", description: "System security compliance checker", fingerprint: "9d:4e:1b:7c:3a:6f", mcpServer: "mcp-auth-01.datacenter.com" },
    { id: 4, name: "BackupManager", description: "Automated backup and recovery", fingerprint: "2b:8f:5c:1d:7e:4a", mcpServer: "mcp-backup-01.datacenter.com" },
    { id: 5, name: "LogAnalyzer", description: "System log inspection and alerting", fingerprint: "7c:3d:9a:4e:1b:6f", mcpServer: "mcp-central-01.datacenter.com" },
    { id: 6, name: "PerformanceMonitor", description: "Real-time system performance tracking", fingerprint: "5a:9e:2c:7b:1d:8f", mcpServer: "mcp-west-01.datacenter.com" },
    { id: 7, name: "ConfigManager", description: "System configuration management", fingerprint: "1e:6b:9d:3a:8c:4f", mcpServer: "mcp-central-02.datacenter.com" },
    { id: 8, name: "APITester", description: "API endpoint testing utility", fingerprint: "8f:2d:6a:9c:3e:7b", mcpServer: "mcp-east-02.datacenter.com" },
    { id: 9, name: "DatabaseOptimizer", description: "Database performance optimization", fingerprint: "4a:7c:2e:8b:5d:1f", mcpServer: "mcp-storage-01.datacenter.com" },
    { id: 10, name: "IntrusionDetector", description: "Network intrusion detection system", fingerprint: "9c:3a:7e:2b:5f:1d", mcpServer: "mcp-auth-01.datacenter.com" },
    { id: 11, name: "LoadBalancer", description: "Traffic distribution and management", fingerprint: "2d:8b:4f:6a:1e:9c", mcpServer: "mcp-west-02.datacenter.com" },
    { id: 12, name: "PatchManager", description: "System patch deployment and tracking", fingerprint: "6b:1f:9d:3c:7a:4e", mcpServer: "mcp-central-01.datacenter.com" },
    { id: 13, name: "ComplianceChecker", description: "Regulatory compliance verification", fingerprint: "3f:8c:2d:6b:9a:4e", mcpServer: "mcp-eu-01.datacenter.com" },
    { id: 14, name: "EncryptionManager", description: "Data encryption and key management", fingerprint: "7d:2a:5f:9c:3b:8e", mcpServer: "mcp-auth-01.datacenter.com" },
    { id: 15, name: "ResourceScheduler", description: "System resource allocation optimizer", fingerprint: "4e:9b:1d:7c:2a:6f", mcpServer: "mcp-asia-01.datacenter.com" }
  ];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  // Calculate total pages
  const totalPages = Math.ceil(toolsData.length / rowsPerPage);
  
  // Get current rows for the page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = toolsData.slice(indexOfFirstRow, indexOfLastRow);
  
  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="text-blue-400 mr-2">
          <Wrench size={24} />
        </div>
        <h1 className="text-2xl font-semibold">All Tools</h1>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tools Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Total Tools</div>
            <div className="text-3xl font-bold text-cyan-400">{dashboardData.tools.count}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Active Tools</div>
            <div className="text-3xl font-bold text-green-400">{dashboardData.tools.active}</div>
          </div>
        </div>
      </div>
      
      {/* Tools Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tools Directory</h2>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
              Search
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Fingerprint</th>
                <th className="px-6 py-3">MCP Server</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentRows.map((tool) => (
                <tr key={tool.id} className="bg-gray-800 hover:bg-gray-750">
                  <td className="px-6 py-4 text-blue-400">{tool.name}</td>
                  <td className="px-6 py-4">{tool.description}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-400">{tool.fingerprint}</td>
                  <td className="px-6 py-4 text-purple-400">{tool.mcpServer}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">Execute</button>
                      <button className="text-gray-400 hover:text-gray-300 text-sm">Configure</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 bg-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, toolsData.length)} of {toolsData.length} tools
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === page ? 'bg-blue-700 text-white' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main NexusOS Component with Navigation
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
  
  // State to track the current active screen
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
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
  
  // Function to refresh data
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
            <h1 className="text-2xl font-bold text-cyan-400">ENTERPRISE AGENTS</h1>
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