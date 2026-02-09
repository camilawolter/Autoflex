import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Package, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

interface SuggestedProduct {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface ProductionSuggestion {
  suggestedProducts: SuggestedProduct[];
  totalValue: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ProductionSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSuggestion = async () => {
    try {
      setLoading(true);
      const response = await api.get<ProductionSuggestion>('/production-suggestion');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestion();
  }, []);

  const handleProduce = async (productId: number, quantity: number) => {
    if (window.confirm(`Do you want to produce ${quantity} units? The stock will be deducted from the database.`)) {
      try {
        await api.post(`/production-suggestion/produce/${productId}?quantity=${quantity}`);
        alert("Production completed successfully! Inventory updated.");
        fetchSuggestion();
      } catch (error: any) {
        alert(error.response?.data || "Error processing production.");
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading production plan...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 text-left">
        <h1 className="text-3xl font-bold text-gray-800">Production Dashboard</h1>
        <p className="text-gray-600">Optimization based on current stock and product value.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg mr-4"><Package className="text-blue-600" /></div>
          <div className="text-left">
            <p className="text-sm text-gray-500 font-semibold">SUGGESTED ITEMS</p>
            <p className="text-2xl font-bold">{data?.suggestedProducts.length || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center">
          <div className="p-3 bg-green-100 rounded-lg mr-4"><DollarSign className="text-green-600" /></div>
          <div className="text-left">
            <p className="text-sm text-gray-500 font-semibold">TOTAL REVENUE</p>
            <p className="text-2xl font-bold">${data?.totalValue.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg mr-4"><TrendingUp className="text-purple-600" /></div>
          <div className="text-left">
            <p className="text-sm text-gray-500 font-semibold">STRATEGY</p>
            <p className="text-lg font-bold">Highest Value First</p>
          </div>
        </div>
      </div>

      {/* Suggested Production Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b text-left">
          <h2 className="text-xl font-bold text-gray-800">Recommended Production Plan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.suggestedProducts.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{item.productName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-bold">{item.quantity} units</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">${item.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleProduce(item.productId, item.quantity)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1 ml-auto"
                    >
                      <CheckCircle size={14} /> Confirm Production
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;