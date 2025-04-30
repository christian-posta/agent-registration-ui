// src/components/AgentsScreen.js
import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, AlertCircle, CheckCircle, XCircle, Loader, ExternalLink } from 'lucide-react';
import { sampleAgentData, getPaginatedData } from '../services/mockData';

// Sample A2A Agent Card for demonstration (would be fetched from URL in real implementation)
const sampleA2ACard = {
  "name": "Google Maps Agent",
  "description": "Plan routes, remember places, and generate directions",
  "url": "https://maps-agent.google.com",
  "provider": {
    "organization": "Google",
    "url": "https://google.com"
  },
  "version": "1.0.0",
  "authentication": {
    "schemes": "OAuth2"
  },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain", "application/html"],
  "capabilities": {
    "streaming": true,
    "pushNotifications": false
  },
  "skills": [
    {
      "id": "route-planner",
      "name": "Route planning",
      "description": "Helps plan routing between two locations",
      "tags": ["maps", "routing", "navigation"],
      "examples": [
        "plan my route from Sunnyvale to Mountain View",
        "what's the commute time from Sunnyvale to San Francisco at 9AM",
        "create turn by turn directions from Sunnyvale to Mountain View"
      ],
      "outputModes": ["application/html", "video/mp4"]
    },
    {
      "id": "custom-map",
      "name": "My Map",
      "description": "Manage a custom map with your own saved places",
      "tags": ["custom-map", "saved-places"],
      "examples": [
        "show me my favorite restaurants on the map",
        "create a visual of all places I've visited in the past year"
      ],
      "outputModes": ["application/html"]
    }
  ]
};

const AgentsScreen = ({ dashboardData }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [agentData, setAgentData] = useState([]);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [agentUrl, setAgentUrl] = useState('');
  const [agentCard, setAgentCard] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setAgentCard(null);
    setFetchError(null);
    setSecurityStatus(null);
    setNewFingerprint('');
  };
  
  // Handle URL input change
  const handleUrlChange = (e) => {
    setAgentUrl(e.target.value);
    setFetchError(null);
  };
  
  // Process step 1: Enter URL and fetch agent card
  const processStep1 = async () => {
    setIsLoading(true);
    setFetchError(null);
    
    try {
      // In a real implementation, this would be an actual fetch call
      // const agentCardUrl = `${agentUrl}/.well-known/agent.json`;
      // const response = await fetch(agentCardUrl);
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch agent card: ${response.status} ${response.statusText}`);
      // }
      // const cardData = await response.json();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration, use the sample data
      const cardData = sampleA2ACard;
      
      // Validate the card data
      if (!cardData.name || !cardData.description || !cardData.url) {
        throw new Error("Invalid agent card: missing required fields");
      }
      
      // Set the agent card state
      setAgentCard(cardData);
      
      // Move to step 2
      setCurrentStep(2);
    } catch (error) {
      setFetchError(error.message || "Failed to fetch agent card");
    } finally {
      setIsLoading(false);
    }
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
    if (securityStatus && securityStatus.passed && agentCard) {
      // Create new agent object
      const newAgent = {
        id: `agent-${agentData.length + 1}`,
        name: agentCard.name,
        description: agentCard.description,
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
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-2xl">
            {/* Step 1: Enter URL */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Register New Agent: Step 1</h2>
                <p className="text-gray-300 mb-4">Enter the base URL for the Agent. We'll look for an A2A Agent Card at [URL]/.well-known/agent.json</p>
                
                <div className="mb-6">
                  <input
                    type="url"
                    value={agentUrl}
                    onChange={handleUrlChange}
                    placeholder="https://agent.example.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    required
                  />
                  
                  {fetchError && (
                    <div className="mt-2 text-red-400 text-sm flex items-start">
                      <AlertCircle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                      <span>{fetchError}</span>
                    </div>
                  )}
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
                    className="px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-600 flex items-center"
                    onClick={processStep1}
                    disabled={isLoading || !agentUrl || !agentUrl.startsWith('http')}
                  >
                    {isLoading ? (
                      <>
                        <Loader size={16} className="animate-spin mr-2" />
                        Fetching...
                      </>
                    ) : (
                      'Next'
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Display Agent Info */}
            {currentStep === 2 && agentCard && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Register New Agent: Step 2</h2>
                <p className="text-gray-300 mb-4">Review the agent information from the A2A Agent Card:</p>
                
                <div className="bg-gray-700 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-cyan-400 text-xl font-semibold">{agentCard.name}</h3>
                      {agentCard.provider && (
                        <div className="text-sm text-gray-400 flex items-center mt-1">
                          by {agentCard.provider.organization}
                          {agentCard.provider.url && (
                            <a 
                              href={agentCard.provider.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 inline-flex items-center ml-2 hover:underline"
                            >
                              <ExternalLink size={12} className="mr-1" />
                              Website
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Version</div>
                      <div className="text-cyan-400 font-mono">{agentCard.version}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-1">Description</div>
                    <p className="text-gray-200">{agentCard.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-1">URL</div>
                    <a 
                      href={agentCard.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:underline flex items-center"
                    >
                      {agentCard.url}
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                  
                  {agentCard.authentication && (
                    <div className="mb-6">
                      <div className="text-sm text-gray-400 mb-1">Authentication</div>
                      <div className="text-gray-200">{agentCard.authentication.schemes}</div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-600 pt-5 mt-5">
                    <h4 className="text-lg font-semibold mb-3">Skills</h4>
                    
                    <div className="space-y-4">
                      {agentCard.skills && agentCard.skills.map((skill) => (
                        <div key={skill.id} className="bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-cyan-400 font-medium">{skill.name}</h5>
                            <div className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                              ID: {skill.id}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{skill.description}</p>
                          
                          {skill.tags && skill.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {skill.tags.map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {skill.examples && skill.examples.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-400 mb-1">Example Commands:</div>
                              <ul className="list-disc pl-5 text-sm text-gray-300">
                                {skill.examples.slice(0, 2).map((example, index) => (
                                  <li key={index}>{example}</li>
                                ))}
                                {skill.examples.length > 2 && (
                                  <li className="text-gray-400">
                                    +{skill.examples.length - 2} more examples
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
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