// src/services/mockData.js

/**
 * Mock data service for providing sample data to the application
 * In a real app, this would be fetched from a backend API
 */

// Sample agent data for the agents screen
export const sampleAgentData = [
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
  ];
  
  // Sample server data for the servers screen
  export const sampleServerData = [
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
  
  // Sample tools data for the tools screen
  export const sampleToolsData = [
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
  
  // Sample LLM data for the LLM screen
  export const sampleLLMData = [
    { id: 1, name: "Claude 3 Opus", provider: "Anthropic", version: "3.0", contextLength: "200K", status: "active" },
    { id: 2, name: "Claude 3 Sonnet", provider: "Anthropic", version: "3.0", contextLength: "200K", status: "active" },
    { id: 3, name: "Claude 3 Haiku", provider: "Anthropic", version: "3.0", contextLength: "200K", status: "active" },
    { id: 4, name: "GPT-4 Turbo", provider: "OpenAI", version: "4.0", contextLength: "128K", status: "active" },
    { id: 5, name: "GPT-4", provider: "OpenAI", version: "4.0", contextLength: "32K", status: "active" },
    { id: 6, name: "GPT-3.5 Turbo", provider: "OpenAI", version: "3.5", contextLength: "16K", status: "active" },
    { id: 7, name: "Gemini Pro", provider: "Google", version: "1.0", contextLength: "32K", status: "active" },
    { id: 8, name: "Gemini Ultra", provider: "Google", version: "1.0", contextLength: "32K", status: "inactive" },
    { id: 9, name: "Mixtral 8x7B", provider: "Mistral", version: "1.0", contextLength: "32K", status: "active" },
    { id: 10, name: "Llama 2 70B", provider: "Meta", version: "2.0", contextLength: "4K", status: "inactive" }
  ];
  
  // Function to get paginated data
  export const getPaginatedData = (data, page, rowsPerPage) => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };