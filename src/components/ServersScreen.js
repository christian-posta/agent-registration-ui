// src/components/ServersScreen.js
import React, { useState, useEffect } from 'react';
import { Server, PlusCircle, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';
import { sampleServerData, getPaginatedData } from '../services/mockData';

const ServersScreen = ({ dashboardData }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [serverData, setServerData] = useState([]);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [serverUrl, setServerUrl] = useState('');
  const [serverInfo, setServerInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [newFingerprint, setNewFingerprint] = useState('');
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
  
  // Start the workflow
  const startRegistrationWorkflow = () => {
    setShowWorkflow(true);
    setCurrentStep(1);
    setServerUrl('');
    setServerInfo(null);
    setSecurityStatus(null);
    setNewFingerprint('');
  };
  
  // Handle URL input change
  const handleUrlChange = (e) => {
    setServerUrl(e.target.value);
  };
  
  // Process step 1: Enter URL
  const processStep1 = () => {
    // Simulate fetching server info from URL
    // In a real app, you would make an API call here
    
    // Mock server info based on URL
    const mockServerInfo = {
      name: `mcp-${new URL(serverUrl).hostname.split('.')[0].toLowerCase()}`,
      version: "3.2.1",
      region: ["US-East", "US-West", "EU-Central", "Asia-Pacific"][Math.floor(Math.random() * 4)],
      description: "This MCP server provides centralized control and coordination for system operations.",
      lastUpdate: new Date().toISOString(),
      tools: [
        {
          name: "file_search",
          description: "Search through files and directories",
          parameters: {
            query: "string",
            path: "string",
            recursive: "boolean"
          }
        },
        {
          name: "code_analysis",
          description: "Analyze code for patterns and issues",
          parameters: {
            file_path: "string",
            analysis_type: ["complexity", "security", "style"]
          }
        },
        {
          name: "database_query",
          description: "Execute SQL queries on connected databases",
          parameters: {
            query: "string",
            database: "string"
          }
        }
      ]
    };
    
    setServerInfo(mockServerInfo);
    setCurrentStep(2);
  };
  
  // Process step 2: Review server info
  const processStep2 = () => {
    setCurrentStep(3);
    setIsProcessing(true);
    
    // Simulate processing time (5 seconds)
    setTimeout(() => {
      // Check if the URL is the bad MCP server
      const isBadServer = new URL(serverUrl).hostname === 'bad-mcp.com';
      
      setIsProcessing(false);
      setSecurityStatus({
        passed: !isBadServer,
        issues: isBadServer ? [
          "Unauthorized access points detected in network configuration",
          "Potential data exposure in server control interface"
        ] : []
      });
      
      if (!isBadServer) {
        // Generate new fingerprint for the server
        const fingerprint = Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        setNewFingerprint(fingerprint);
      }
      
      setCurrentStep(4);
    }, 5000);
  };
  
  // Process step 4: Final step (if passed security check)
  const completeRegistration = () => {
    if (securityStatus && securityStatus.passed) {
      // Create new server object
      const newServer = {
        id: `server-${serverData.length + 1}`,
        name: serverInfo.name,
        description: serverInfo.description,
        fingerprint: newFingerprint,
        status: 'online',
        region: serverInfo.region,
        uptime: 0,
        load: 10
      };
      
      // Add new server to the list
      setServerData([...serverData, newServer]);
    }
    
    // Close the workflow
    setShowWorkflow(false);
  };
  
  // Close the workflow without saving
  const cancelWorkflow = () => {
    setShowWorkflow(false);
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
          onClick={startRegistrationWorkflow}
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
      
      {/* Registration Workflow Modal */}
      {showWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            {/* Step 1: Enter URL */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Register New MCP Server: Step 1</h2>
                <p className="text-gray-300 mb-4">Please enter the URL for the MCP Server you want to register:</p>
                
                {/* For demonstration purposes */}
                <div className="bg-gray-700 p-3 rounded mb-4 text-sm text-gray-300 flex items-start">
                  <div className="text-yellow-400 mr-2 flex-shrink-0 mt-0.5">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <span className="font-medium">Demo Tip:</span> Try "https://bad-mcp.com" for a server that will fail the security check.
                  </div>
                </div>
                
                <div className="mb-6">
                  <input
                    type="url"
                    value={serverUrl}
                    onChange={handleUrlChange}
                    placeholder="https://mcp-server.example.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                    onClick={cancelWorkflow}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600"
                    onClick={processStep1}
                    disabled={!serverUrl || !serverUrl.startsWith('http')}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Display Server Info */}
            {currentStep === 2 && serverInfo && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Register New MCP Server: Step 2</h2>
                <p className="text-gray-300 mb-4">Please review the server information:</p>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Name:</p>
                      <p className="text-purple-400 font-semibold">{serverInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Version:</p>
                      <p>{serverInfo.version}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Description:</p>
                    <p>{serverInfo.description}</p>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Region:</p>
                    <p>{serverInfo.region}</p>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Last Update:</p>
                    <p>{new Date(serverInfo.lastUpdate).toLocaleString()}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Available Tools:</p>
                    <div className="mt-2 space-y-2">
                      {serverInfo.tools.map((tool, index) => (
                        <div key={index} className="bg-gray-800 rounded p-3">
                          <div className="flex items-center">
                            <span className="text-purple-400 font-semibold">{tool.name}</span>
                            <span className="ml-2 text-sm text-gray-400">({Object.keys(tool.parameters).length} parameters)</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{tool.description}</p>
                          <div className="mt-2">
                            <p className="text-xs text-gray-400">Parameters:</p>
                            <ul className="list-disc list-inside text-xs text-gray-300">
                              {Object.entries(tool.parameters).map(([param, type]) => (
                                <li key={param}>
                                  <span className="text-purple-300">{param}</span>: {Array.isArray(type) ? type.join(' | ') : type}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                    onClick={cancelWorkflow}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600"
                    onClick={processStep2}
                  >
                    Verify Security
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Processing */}
            {currentStep === 3 && isProcessing && (
              <div className="text-center py-8">
                <Loader size={48} className="mx-auto mb-4 animate-spin text-purple-400" />
                <h2 className="text-xl font-semibold mb-2">Processing Security Check</h2>
                <p className="text-gray-300">Scanning for prompt injections and shadowing...</p>
              </div>
            )}
            
            {/* Step 4: Security Results */}
            {currentStep === 4 && securityStatus && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Register New MCP Server: Security Check</h2>
                
                {securityStatus.passed ? (
                  <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle size={24} className="text-green-500 mr-2" />
                      <h3 className="text-lg font-semibold text-green-500">Security Check Passed</h3>
                    </div>
                    <p className="mt-2 text-gray-300">No security issues detected. This MCP server is safe to register.</p>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-400">New Server Fingerprint:</p>
                      <p className="font-mono text-sm bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                        {newFingerprint}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <XCircle size={24} className="text-red-500 mr-2" />
                      <h3 className="text-lg font-semibold text-red-500">Security Check Failed</h3>
                    </div>
                    <p className="mt-2 text-gray-300">Security issues were detected. This MCP server may not be safe to register.</p>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-400">Issues Detected:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {securityStatus.issues.map((issue, index) => (
                          <li key={index} className="text-red-400">{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                    onClick={cancelWorkflow}
                  >
                    Cancel
                  </button>
                  {securityStatus.passed ? (
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600"
                      onClick={completeRegistration}
                    >
                      Complete Registration
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600"
                      onClick={cancelWorkflow}
                    >
                      Abort Registration
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServersScreen;