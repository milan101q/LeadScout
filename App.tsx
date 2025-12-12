import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultsList } from './components/ResultsList';
import { SearchCriteria, SearchStatus, BusinessLead } from './types';
import { findLeads } from './services/gemini';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<SearchStatus>(SearchStatus.IDLE);
  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (criteria: SearchCriteria) => {
    setStatus(SearchStatus.LOADING);
    setError(null);
    setLeads([]);

    try {
      const results = await findLeads(criteria);
      setLeads(results);
      setStatus(SearchStatus.SUCCESS);
      
      if (results.length === 0) {
        setError("No businesses found matching these strict criteria. Try increasing the max rating or changing the location.");
      }
    } catch (err: any) {
      setStatus(SearchStatus.ERROR);
      setError(err.message || "An unexpected error occurred while searching.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Find qualified business leads
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Automatically scan Google Maps for businesses with low ratings and no online presence. 
            Perfect for agencies offering SEO and reputation management.
          </p>
        </div>

        <SearchForm onSearch={handleSearch} status={status} />

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Search Alert</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        <ResultsList leads={leads} />
      </main>
    </div>
  );
};

export default App;