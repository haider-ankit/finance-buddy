"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMerchantList, MerchantSummary } from "../services/api";
import { Store, ChevronRight, Search } from "lucide-react";

export default function DirectoryPage() {
  const [merchants, setMerchants] = useState<MerchantSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMerchants() {
      try {
        const data = await fetchMerchantList();
        setMerchants(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load merchant directory.");
      } finally {
        setLoading(false);
      }
    }
    loadMerchants();
  }, []);

  // Filter the list based on the search input
  const filteredMerchants = merchants.filter((merchant) =>
    merchant.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center animate-pulse text-gray-500">Loading Directory...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">MSME Application Queue</h1>
        <p className="text-gray-500 mb-8">Select a merchant to view their AI-generated Financial Health Card.</p>
        
        {/* Search Bar - Styled to match the modern aesthetic */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white text-gray-900 shadow-sm"
            placeholder="Search for a merchant by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* The Original Grid Design */}
        <div className="grid grid-cols-1 gap-4">
          {filteredMerchants.length > 0 ? (
            filteredMerchants.map((merchant) => (
              <Link 
                key={merchant.merchant_id} 
                href={`/merchant/${merchant.merchant_id}`}
                className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      <Store className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {merchant.business_name}
                      </h2>
                      <p className="text-sm text-gray-500 font-mono mt-1">ID: {merchant.merchant_id}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-500" />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center p-12 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No merchants found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}