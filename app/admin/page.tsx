'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rawResponse, setRawResponse] = useState<any>(null);
  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/subscribe');
        const data = await response.json();
        
        // Store raw response for debugging
        setRawResponse(data);
        
        if (data.success) {
          setSubscriptions(data.subscriptions || []);
        } else {
          setError(data.error || 'Failed to fetch subscriptions');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching subscriptions');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Supabase Integration Active</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your email subscriptions are now being stored securely in Supabase!</p>
                <p className="mt-2">Additional security recommendations:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Add authentication to this admin page</li>
                  <li>Set up Row Level Security in Supabase</li>
                  <li>Consider adding email verification workflows</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Email Subscriptions</h1>
            
            <a 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Home
            </a>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
              {rawResponse && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-700 mb-2">Debug Information:</p>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(rawResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : subscriptions.length === 0 ? (
            <p className="text-gray-600 py-4">No email subscriptions yet.</p>
          ) : (
            <>
              <p className="text-gray-600 mb-4">Total subscriptions: {subscriptions.length}</p>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptions.map((email, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Supabase Integration Guide</h2>
          
          <div className="prose max-w-none">
            <p>Your application is now using Supabase to store email subscriptions. Here's what's been implemented:</p>
            
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Emails are stored in the <code>subscriptions</code> table in your Supabase project</li>
              <li>Duplicate submissions are automatically detected and prevented</li>
              <li>The admin page fetches data directly from Supabase</li>
            </ul>
            
            <h3 className="text-base font-semibold mt-4">Accessing Your Supabase Dashboard</h3>
            <p>You can view and manage your subscriptions directly in the Supabase dashboard:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to <a href="https://app.supabase.com" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener">https://app.supabase.com</a></li>
              <li>Log in to your account</li> 
              <li>Navigate to your project</li>
              <li>Go to Table Editor → subscriptions</li>
            </ol>
            
            <p className="mt-4 text-sm text-gray-500">Note: Your Supabase URL and API key are stored securely in your <code>.env.local</code> file.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 