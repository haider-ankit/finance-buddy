"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchHealthCardById } from "../../../services/api";
import { HealthScoreOutput } from "../../../types";
import { 
  ShieldCheck, AlertTriangle, CheckCircle, 
  Activity, FileText, Users, ArrowLeft 
} from "lucide-react";

export default function HealthCardPage() {
  const params = useParams();
  const router = useRouter();
  const merchant_id = params.merchant_id as string;
  
  const [data, setData] = useState<HealthScoreOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchHealthCardById(merchant_id);
        setData(result);
      } catch (err) {
        setError("Failed to fetch merchant data.");
      } finally {
        setLoading(false);
      }
    }
    if (merchant_id) loadData();
  }, [merchant_id]);

  if (loading || !data) return <div className="p-8 text-center animate-pulse">Analyzing Data...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium mb-4"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Queue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Merchant Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Merchant Profile</h2>
            <div className="text-2xl font-bold text-gray-900">{data.business_name}</div>
            <div className="text-gray-500 font-mono text-sm mt-1">ID: {data.merchant_id}</div>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-blue-600 mb-2"><Activity size={18} className="mr-2"/> UPI Velocity</div>
                <div className="text-2xl font-bold">{data.metrics.upi_velocity_score}/100</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-purple-600 mb-2"><FileText size={18} className="mr-2"/> GST Status</div>
                <div className="text-2xl font-bold">{data.metrics.gst_compliance_score}/100</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg opacity-50">
                <div className="flex items-center text-gray-500 mb-2"><Users size={18} className="mr-2"/> EPFO Scale</div>
                <div className="text-lg font-semibold italic">Pending Sync</div>
              </div>
            </div>
          </div>

          {/* Master Decision Card */}
          <div className={`p-6 rounded-xl shadow-sm border flex flex-col justify-center items-center text-center ${
            data.credit_decision === "APPROVED" ? "bg-green-50 border-green-200" :
            data.credit_decision === "REJECTED" ? "bg-red-50 border-red-200" :
            "bg-yellow-50 border-yellow-200"
          }`}>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">CredShield Score</div>
            <div className={`text-6xl font-black mb-4 ${
              data.credit_decision === "APPROVED" ? "text-green-600" :
              data.credit_decision === "REJECTED" ? "text-red-600" :
              "text-yellow-600"
            }`}>
              {data.overall_health_score}
            </div>
            <div className={`px-4 py-1 rounded-full text-sm font-bold border ${
              data.credit_decision === "APPROVED" ? "bg-green-100 text-green-700 border-green-300" :
              data.credit_decision === "REJECTED" ? "bg-red-100 text-red-700 border-red-300" :
              "bg-yellow-100 text-yellow-700 border-yellow-300"
            }`}>
              {data.credit_decision.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Strengths & Risks Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
              <ShieldCheck className="text-green-500 mr-2" /> Verified Strengths
            </h3>
            <ul className="space-y-3">
              {data.strengths.length > 0 ? data.strengths.map((s, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{s}</span>
                </li>
              )) : <li className="text-gray-500 italic">No positive indicators detected.</li>}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-2" /> Risk Intelligence
            </h3>
            <div className="space-y-4">
              {data.risk_flags.length > 0 ? data.risk_flags.map((flag, i) => (
                <div key={i} className={`p-4 rounded-lg border ${
                  flag.severity === "CRITICAL" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900">{flag.category}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-200 text-red-800">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{flag.description}</p>
                </div>
              )) : (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-800 flex items-center">
                  <CheckCircle size={18} className="mr-2" /> No significant risks detected.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}