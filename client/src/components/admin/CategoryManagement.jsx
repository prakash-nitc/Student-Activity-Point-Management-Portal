import { useEffect, useState } from 'react';
import { createAdminCategory, getAdminAllUsers, getAdminCategories, updateAdminCategoryFA } from '../../services/api';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [fas, setFAs] = useState([]);
    
    // State for the new category form
    const [newName, setNewName] = useState('');
    const [newFaId, setNewFaId] = useState('');
    
    // This state holds the selected value for each dropdown
    const [selectedFaOverrides, setSelectedFaOverrides] = useState({});

    const fetchData = async () => {
        try {
            const catRes = await getAdminCategories();
            setCategories(catRes.data);
            
            const userRes = await getAdminAllUsers();
            setFAs(userRes.data.filter(user => user.role === 'fa'));
            
            // This pre-fills the dropdowns with the current assignments
            const initialOverrides = {};
            catRes.data.forEach(cat => {
                if (cat.override_fa_id) {
                    initialOverrides[cat._id] = cat.override_fa_id._id;
                }
            });
            setSelectedFaOverrides(initialOverrides);
            
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newName) {
            alert('Category name is required.');
            return;
        }
        try {
            await createAdminCategory({ name: newName, override_fa_id: newFaId || null });
            alert('Category created successfully!');
            setNewName('');
            setNewFaId('');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create category.');
        }
    };
    
    const handleUpdateCategoryFA = async (categoryId) => {
        const faId = selectedFaOverrides[categoryId] || null;
        try {
            await updateAdminCategoryFA(categoryId, faId);
            alert('Category FA updated successfully!');
            fetchData();
        } catch (error) {
            alert('Failed to update category FA.');
        }
    };
    
    // --- THIS IS THE CRITICAL FUNCTION THAT WAS LIKELY MISSING ---
    // This function updates the state as you change the dropdown
    const handleSelectChange = (categoryId, faId) => {
        setSelectedFaOverrides(prev => ({...prev, [categoryId]: faId}));
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Category Management</h3>
            
            {/* --- Create New Category Form --- */}
            <form onSubmit={handleCreateCategory} className="mb-6 p-4 border rounded-lg space-y-3 bg-gray-50">
                <h4 className="text-lg font-medium">Create New Category</h4>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Assign Faculty</label>
                    <select
                        value={newFaId}
                        onChange={(e) => setNewFaId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md"
                    >
                        <option value="">None</option>
                        {fas.map(fa => (
                            <option key={fa._id} value={fa._id}>{fa.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create</button>
            </form>
            
            {/* --- Existing Categories Table --- */}
            <h4 className="text-lg font-medium mb-2">Manage Existing Categories</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Override FA</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {/* --- THIS IS THE CORRECTED DROPDOWN --- */}
                                    <select
                                        value={selectedFaOverrides[cat._id] || ''}
                                        onChange={(e) => handleSelectChange(cat._id, e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                    >
                                        <option value="">None (Use Student's Primary FA)</option>
                                        {fas.map(fa => (
                                            <option key={fa._id} value={fa._id}>{fa.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleUpdateCategoryFA(cat._id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Save</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManagement;