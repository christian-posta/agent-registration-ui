// src/components/ServersScreen.js
import React, { useState, useEffect } from 'react';
import { Server, PlusCircle } from 'lucide-react';
import { sampleServerData, getPaginatedData } from '../services/mockData';

const ServersScreen = ({ dashboardData }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [serverData, setServerData] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newServer, setNewServer] = useState({
    name: '',
    description: '',
    fingerprint: '',
    region: 'US-East'
  });
  const rowsPerPage = 5;
  
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setServerData(sampleServerData);
  }, []);
  
  // Calculate total pages
  const totalPages = Math.ceil(serverData.length / rowsPerPage);
  
  // Get current rows for the page
  const currentRows = getPaginatedData(serverData, currentPage, rowsPerPage);
  
  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Calculate display indexes for pagination UI
  const indexOfFirstRow = (currentPage - 1) * rowsPerPage + 1;
  const indexOfLastRow = Math.min(currentPage * rowsPerPage, serverData.length);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewServer(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleRegisterServer = (e) => {
    e.preventDefault();
    
    // Generate a random fingerprint if not provided
    const fingerprint = newServer.fingerprint || 
      Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Create new server object
    const server = {
      id: `server-${serverData.length + 1}`,
      name: newServer.name,
      description: newServer.description,
      fingerprint: fingerprint,
      status: 'online',
      region: newServer.region,
      uptime: 0,
      load: 10
    };
    
    // Add new server to the list
    setServerData([...serverData, server]);
    
    // Reset form and close modal
    setNewServer({
      name: '',
      description: '',
      fingerprint: '',
      region: 'US-East'
    });
    setShowRegisterModal(false);
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="text-purple-400 mr-2">
            <Server size={24} />
          </div>
          <h1 className="text-2xl font-semibold">MCP Servers</h1>
        </div>
        
        {/* Register New MCP Server Button */}
        <button 
          className="flex items-center bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
          onClick={() => setShowRegisterModal(true)}
        >
          <PlusCircle size={18} className="mr-2" />
          Register New MCP Server
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Server Status Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Total Servers</div>
            <div className="text-3xl font-bold text-cyan-400">{dashboardData?.servers?.count || serverData.length}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Online Servers</div>
            <div className="text-3xl font-bold text-green-400">{dashboardData?.servers?.online || serverData.filter(s => s.status === 'online').length}</div>
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
            Showing {indexOfFirstRow} to {indexOfLastRow} of {serverData.length} servers
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
      
      {/* Register Server Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Register New MCP Server</h2>
            
            <form onSubmit={handleRegisterServer}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Server Name</label>
                <input
                  type="text"
                  name="name"
                  value={newServer.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newServer.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 h-24"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Region</label>
                <select
                  name="region"
                  value={newServer.region}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="US-East">US-East</option>
                  <option value="US-West">US-West</option>
                  <option value="EU-Central">EU-Central</option>
                  <option value="Asia-Pacific">Asia-Pacific</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Fingerprint (Optional)</label>
                <input
                  type="text"
                  name="fingerprint"
                  value={newServer.fingerprint}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if left blank"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-sm"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServersScreen;