"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchMerchantList, MerchantSummary } from "../services/api";
import { Store, ChevronRight } from "lucide-react";

export default function DirectoryPage() {
  const [merchants, setMerchants] = useState<MerchantSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMerchants() {
      try {
        const data = await fetchMerchantList();
        setMerchants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMerchants();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Directory...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">MSME Application Queue</h1>
        <p className="text-gray-500 mb-8">Select a merchant to view their AI-generated Financial Health Card.</p>
        
        <div className="grid grid-cols-1 gap-4">
          {merchants.map((merchant) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}