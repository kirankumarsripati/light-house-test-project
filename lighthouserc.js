module.exports = {
  ci: {
    collect: {
      puppeteerScript: 'lighthouse/generate-stats.js',  // Ensure there's an authenticated user before running Lighthouse
      puppeteerLaunchOptions: {  
        defaultViewport: null  
      },    
    
    
    upload: {
      target: 'lhci',
      serverBaseUrl: 'http://18.200.44.239:9001/',
      token: '5d8f69f7-7813-4c40-86b5-47ff5eb513bf', // could also use LHCI_TOKEN variable instead
    },
  },
};
