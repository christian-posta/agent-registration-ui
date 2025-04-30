// src/components/AgentsScreen.js
import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';
import { sampleAgentData, getPaginatedData } from '../services/mockData';

const AgentsScreen = ({ dashboardData }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [agentData, setAgentData] = useState([]);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [agentUrl, setAgentUrl] = useState('');
  const [agentInfo, setAgentInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [newFingerprint, setNewFingerprint] = useState('');
  const rowsPerPage = 5;
  
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setAgentData(sampleAgentData);
  }, []);
  
  // Calculate total pages
  const totalPages = Math.ceil(agentData.length / rowsPerPage);
  
  // Get current rows for the page
  const currentRows = getPaginatedData(agentData, currentPage, rowsPerPage);
  
  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Calculate display indexes for pagination UI
  const indexOfFirstRow = (currentPage - 1) * rowsPerPage + 1;
  const indexOfLastRow = Math.min(currentPage * rowsPerPage, agentData.length);
  
  // Start the workflow
  const startRegistrationWorkflow = () => {
    setShowWorkflow(true);
    setCurrentStep(1);
    setAgentUrl('');
    setAgentInfo(null);
    setSecurityStatus(null);
    setNewFingerprint('');
  };
  
  // Handle URL input change
  const handleUrlChange = (e) => {
    setAgentUrl(e.target.value);
  };
  
  // Process step 1: Enter URL
  const processStep1 = () => {
    // Simulate fetching agent info from URL
    // In a real app, you would make an API call here
    
    // Mock agent info based on URL
    const mockAgentInfo = {
      name: `Agent from ${new URL(agentUrl).hostname}`,
      version: "1.0.3",
      description: "This agent provides automated data processing capabilities for system analytics and monitoring.",
      capabilities: [
        "System monitoring",
        "Data processing",
        "Analytics reporting"
      ],
      lastUpdate: new Date().toISOString()
    };
    
    setAgentInfo(mockAgentInfo);
    setCurrentStep(2);
  };
  
  // Process step 2: Review agent info
  const processStep2 = () => {
    setCurrentStep(3);
    setIsProcessing(true);
    
    // Simulate processing time (5 seconds)
    setTimeout(() => {
      // Randomly determine if security issues were found
      // In a real app, this would be actual security analysis
      const securityIssues = Math.random() > 0.7; // 30% chance of security issues
      
      setIsProcessing(false);
      setSecurityStatus({
        passed: !securityIssues,
        issues: securityIssues ? [
          "Potential prompt injection detected in agent response handler",
          "Possible shadow commands in initialization sequence"
        ] : []
      });
      
      if (!securityIssues) {
        // Generate new fingerprint for the agent
        const fingerprint = Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        setNewFingerprint(fingerprint);
      }
      
      setCurrentStep(4);
    }, 5000);
  };
  
  // Process step 4: Final step (if passed security check)
  const completeRegistration = () => {
    if (securityStatus && securityStatus.passed) {
      // Create new agent object
      const newAgent = {
        id: `agent-${agentData.length + 1}`,
        name: agentInfo.name,
        description: agentInfo.description,
        fingerprint: newFingerprint,
        status: 'active',
        lastSeen: new Date().toISOString()
      };
      
      // Add new agent to the list
      setAgentData([...agentData, newAgent]);
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
          <div className="text-cyan-400 mr-2">
            <Users size={24} />
          </div>
          <h1 className="text-2xl font-semibold">Agents Management</h1>
        </div>
        
        {/* Register New Agent Button */}
        <button 
          className="flex items-center bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-md"
          onClick={startRegistrationWorkflow}
        >
          <PlusCircle size={18} className="mr-2" />
          Register New Agent
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Agent Status Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Total Agents</div>
            <div className="text-3xl font-bold text-cyan-400">{dashboardData?.agents?.count || agentData.length}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-lg text-gray-300 mb-2">Active Agents</div>
            <div className="text-3xl font-bold text-green-400">{dashboardData?.agents?.active || agentData.filter(a => a.status === 'active').length}</div>
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
            Showing {indexOfFirstRow} to {indexOfLastRow} of {agentData.length} agents
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
      
      {/* Registration Workflow Modal */}
      {showWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md">
            {/* Step 1: Enter URL */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Register New Agent: Step 1</h2>
                <p className="text-gray-300 mb-4">Please enter the URL for the Agent you want to register:</p>
                
                <div className="mb-6">
                  <input
                    type="url"
                    value={agentUrl}
                    onChange={handleUrlChange}
                    placeholder="https://agent.example.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
                    className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-600"
                    onClick={processStep1}
                    disabled={!agentUrl || !agentUrl.startsWith('http')}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Display Agent Info */}
            {currentStep === 2 && agentInfo && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Register New Agent: Step 2</h2>
                <p className="text-gray-300 mb-4">Please review the agent information:</p>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Name:</p>
                      <p className="text-cyan-400 font-semibold">{agentInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Version:</p>
                      <p>{agentInfo.version}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Description:</p>
                    <p>{agentInfo.description}</p>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Capabilities:</p>
                    <ul className="list-disc pl-5">
                      {agentInfo.capabilities.map((cap, index) => (
                        <li key={index}>{cap}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Last Update:</p>
                    <p>{new Date(agentInfo.lastUpdate).toLocaleString()}</p>
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
                    className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-600"
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
                <Loader size={48} className="mx-auto mb-4 animate-spin text-cyan-400" />
                <h2 className="text-xl font-semibold mb-2">Processing Security Check</h2>
                <p className="text-gray-300">Scanning for prompt injections and shadowing...</p>
              </div>
            )}
            
            {/* Step 4: Security Results */}
            {currentStep === 4 && securityStatus && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Register New Agent: Security Check</h2>
                
                {securityStatus.passed ? (
                  <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle size={24} className="text-green-500 mr-2" />
                      <h3 className="text-lg font-semibold text-green-500">Security Check Passed</h3>
                    </div>
                    <p className="mt-2 text-gray-300">No security issues detected. This agent is safe to register.</p>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-400">New Agent Fingerprint:</p>
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
                    <p className="mt-2 text-gray-300">Security issues were detected. This agent may not be safe to register.</p>
                    
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

export default AgentsScreen;