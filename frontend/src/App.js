// frontend/src/App.js
import React, { useState } from 'react';
import './App.css';
import DeveloperSubmissionForm from './components/DeveloperSubmissionForm';
import AAHDCAdminPage from './pages/AAHDCAdminPage';

function App() {
  const [view, setView] = useState('developer'); // 'developer' or 'admin'

  return (
    <div className="App">
      <header className="App-header">
        <h1>AAHDC Lottery Distribution Platform</h1>
        <nav>
          <button
            onClick={() => setView('developer')}
            className={view === 'developer' ? 'active' : ''}
          >
            Developer Portal
          </button>
          <button
            onClick={() => setView('admin')}
            className={view === 'admin' ? 'active' : ''}
          >
            AAHDC Admin
          </button>
        </nav>
      </header>
      <main>
        {view === 'developer' ? <DeveloperSubmissionForm /> : <AAHDCAdminPage />}
      </main>
    </div>
  );
}

export default App;
