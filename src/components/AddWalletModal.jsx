import { useState } from "react";

export const AddWalletModal = ({ show, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      name: '',
      apiKey: '',
      secretKey: ''
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd({
        ...formData,
        id: Date.now().toString()
      });
      setFormData({ name: '', apiKey: '', secretKey: '' });
    };
  
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Add New Wallet</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Wallet Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">API Key</label>
                  <input
                    type="text"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={formData.secretKey}
                    onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };