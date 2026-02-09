import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setProducts } from '../store/productSlice';
import { setMaterials } from '../store/materialSlice';
import api from '../api/api';
import { Plus, Layers, Trash2, Save, ShoppingBag, X, Loader2 } from 'lucide-react';

interface SelectedMaterial {
  materialId: number;
  name: string;
  requiredQuantity: number;
}

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const materials = useSelector((state: RootState) => state.materials.items);
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: 0 });

  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([]);
  const [currentMaterialId, setCurrentMaterialId] = useState<number>(0);
  const [currentQty, setCurrentQty] = useState<number>(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProd, resMat] = await Promise.all([
        api.get('/products'),
        api.get('/materials')
      ]);
      dispatch(setProducts(resProd.data));
      dispatch(setMaterials(resMat.data));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMaterialToRecipe = () => {
    const material = materials.find(m => m.id === currentMaterialId);
    if (material && currentQty > 0) {
      // Avoid duplicates in the temporary list.
      if (selectedMaterials.find(m => m.materialId === material.id)) {
        alert("This ingredient has already been added to the recipe.");
        return;
      }
      setSelectedMaterials([...selectedMaterials, { 
        materialId: material.id!, 
        name: material.name, 
        requiredQuantity: currentQty 
      }]);
      setCurrentQty(0);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Tem a certeza que deseja eliminar este produto?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (error) {
        alert("Error deleting product.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMaterials.length === 0) {
      alert("Add at least one raw material to the recipe.");
      return;
    }

    try {
      // Create the Product.
      const resProduct = await api.post('/products', formData);
      const newProduct = resProduct.data;

      // Create the associations.
      for (const item of selectedMaterials) {
        await api.post(`/products/${newProduct.id}/materials`, {
          rawMaterial: { id: item.materialId },
          requiredQuantity: item.requiredQuantity
        });
      }

      setIsModalOpen(false);
      setSelectedMaterials([]);
      setFormData({ name: '', price: 0 });
      fetchData(); 
    } catch (error) {
      alert("Error saving product.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-800">Products Catalog</h1>
          <p className="text-gray-500">Manage products and their manufacturing recipes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Create Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                    <span className="text-green-600 font-bold text-xl">${product.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteProduct(product.id!)}
                    className="text-gray-300 hover:text-red-600 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="border-t border-gray-50 pt-4 mt-2">
                  <h4 className="text-xs uppercase font-bold text-gray-400 mb-3 text-left flex items-center gap-1">
                    <Layers size={14}/> Composition:
                  </h4>
                  <ul className="space-y-2">
                    {(product as any).materials?.map((m: any) => (
                      <li key={m.id} className="text-sm text-gray-600 flex justify-between bg-gray-50 px-3 py-1 rounded">
                        <span>{m.rawMaterial.name}</span>
                        <span className="font-mono font-bold text-blue-600">{m.requiredQuantity} units</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-left">
              <ShoppingBag className="text-blue-600" /> New Product Configuration
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input required className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                    type="text" placeholder="Ex: Office Chair"
                    onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Selling Price ($)</label>
                  <input required className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                    type="number" step="0.01" placeholder="0.00"
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
              </div>

              {/* Revenue Section (Materials Association) */}
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <Plus size={16}/> Build Product Recipe
                </h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <select className="flex-1 min-w-[200px] p-2 border rounded-lg bg-white" 
                    value={currentMaterialId}
                    onChange={e => setCurrentMaterialId(Number(e.target.value))}>
                    <option value="0">Select material...</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (Available: {m.stockQuantity})</option>
                    ))}
                  </select>
                  <input className="w-24 p-2 border rounded-lg bg-white" type="number" placeholder="Qty"
                    value={currentQty || ''} onChange={e => setCurrentQty(Number(e.target.value))} />
                  <button type="button" onClick={handleAddMaterialToRecipe} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedMaterials.length === 0 && <p className="text-xs text-gray-400 italic">No materials added to this recipe yet.</p>}
                  {selectedMaterials.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-blue-600">{item.requiredQuantity} units</span>
                        <button type="button" onClick={() => setSelectedMaterials(selectedMaterials.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                  <Save size={20}/> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;