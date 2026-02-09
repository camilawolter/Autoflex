import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setMaterials } from '../store/materialSlice';
import api from '../api/api';
import { Plus, Database, Loader2, Edit2, Trash2, X, Save } from 'lucide-react';

interface RawMaterial {
  id?: number;
  name: string;
  stockQuantity: number;
}

const MaterialsPage: React.FC = () => {
  const dispatch = useDispatch();
  const materials = useSelector((state: RootState) => state.materials.items);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RawMaterial>({ name: '', stockQuantity: 0 });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/materials');
      dispatch(setMaterials(response.data));
    } catch (error) {
      console.error("Erro ao carregar materiais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await api.put(`/materials/${formData.id}`, formData);
      } else {
        const { id, ...dataToPost } = formData;
        await api.post('/materials', dataToPost);
      }
      
      closeModal();
      fetchMaterials();
    } catch (error) {
      alert("Error saving raw materials. Check the connection to the server.");
    }
  };

  // Prepare the modal for editing.
  const handleEdit = (material: RawMaterial) => {
    setFormData(material);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to eliminate this raw material?")) {
      try {
        await api.delete(`/materials/${id}`);
        fetchMaterials();
      } catch (error) {
        alert("Error deleting material. Ensure this material is not associated with any products.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ name: '', stockQuantity: 0 });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-800">Raw Materials</h1>
          <p className="text-gray-500">Inventory control and stock management.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus size={20} /> Add Material
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs uppercase font-semibold text-gray-600">ID</th>
                <th className="px-6 py-4 text-xs uppercase font-semibold text-gray-600">Material Name</th>
                <th className="px-6 py-4 text-xs uppercase font-semibold text-gray-600">Stock Quantity</th>
                <th className="px-6 py-4 text-xs uppercase font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {materials.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-mono">#{item.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className={`font-bold ${item.stockQuantity <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                      {item.stockQuantity}
                    </span> units
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id!)} 
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                    No materials found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal (Creation and Editing) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20}/>
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <Database className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Update Material' : 'New Raw Material'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Material Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Aluminum, Wood, Steel..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Current Stock</label>
                <input 
                  required
                  type="number" 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Save size={18} /> {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;