// src/services/api.js

/**
 * API service for fetching data
 * This simulates API calls to a backend server
 */
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
  
  export default API;