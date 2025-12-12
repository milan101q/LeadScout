import React from 'react';
import { BusinessLead } from '../types';
import { Star, MapPin, Phone, ExternalLink, Download, Building2 } from 'lucide-react';

interface ResultsListProps {
  leads: BusinessLead[];
}

export const ResultsList: React.FC<ResultsListProps> = ({ leads }) => {
  const downloadCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Company Name', 'Rating', 'Reviews', 'Phone', 'Address', 'Postal Code', 'Maps URL'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.companyName}"`,
        lead.rating,
        lead.reviewCount,
        `"${lead.phoneNumber}"`,
        `"${lead.address}"`,
        `"${lead.postalCode}"`,
        `"${lead.googleMapsUrl}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (leads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Found {leads.length} Potential Leads
        </h2>
        <button
          onClick={downloadCSV}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {lead.companyName}
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                   <div className="flex items-center">
                     <span className="font-medium text-gray-900 mr-1">{lead.rating}</span>
                     <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                   </div>
                   <span className="mx-1.5">·</span>
                   <span>{lead.reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{lead.address} {lead.postalCode}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{lead.phoneNumber || 'No phone listed'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                &lt; 4.0 Stars
              </span>
              <a 
                href={lead.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                View on Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};