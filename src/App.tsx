import React from 'react';
import { Navigation } from './components/Navigation';
import { CampaignsHeader } from './components/CampaignsHeader';
import { CampaignsTable } from './components/CampaignsTable';

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <Navigation />
      
      <main className="main-container">
        <CampaignsHeader />
        <CampaignsTable />
      </main>
    </div>
  );
}

export default App;