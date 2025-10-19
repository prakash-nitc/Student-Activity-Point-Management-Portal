import { useEffect, useState } from 'react';
import { createCategory, getAllCategories, getAllUsers } from '../../services/api';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [fas, setFAs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for the new category form
    const [name, setName] = useState('');
    const [max_points, setMaxPoints] = useState('');
    const [override_fa_id, setOverrideFaId] = useState('');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const categoriesRes = await getAllCategories();
            setCategories(categoriesRes.data);

            const usersRes = await getAllUsers();
            setFAs(usersRes.data.filter(user => user.role === 'fa'));
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            alert('Category name is required.');
            return;
        }

        const categoryData = {
            name,
            max_points: max_points || null,
            override_fa_id: override_fa_id || null,
        };

        try {
            await createCategory(categoryData);
            alert('Category created successfully!');
            // Reset form and refresh data
            setName('');
            setMaxPoints('');
            setOverrideFaId('');
            fetchData();
        } catch (error) {
            alert('Failed to create category. It might already exist.');
            console.error(error);
        }
    };

    if (isLoading) {
        return <p>Loading categories...</p>;
    }

    return (
        <div>
            <h3>Create New Category</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Sports Tournament"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Max Points (Optional)</label>
                    <input
                        type="number"
                        value={max_points}
                        onChange={(e) => setMaxPoints(e.target.value)}
                        placeholder="e.g., 20"
                    />
                </div>
                <div className="form-group">
                    <label>Override Faculty Advisor (Optional)</label>
                    <select value={override_fa_id} onChange={(e) => setOverrideFaId(e.target.value)}>
                        <option value="">None (Use Student's Primary FA)</option>
                        {fas.map(fa => (
                            <option key={fa._id} value={fa._id}>{fa.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Create Category</button>
            </form>

            <hr style={{ margin: '2rem 0' }} />

            <h3>Existing Categories</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Max Points</th>
                        <th>Override FA</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => (
                        <tr key={cat._id}>
                            <td>{cat.name}</td>
                            <td>{cat.max_points || 'N/A'}</td>
                            <td>{cat.override_fa_id ? cat.override_fa_id.name : 'None'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryManagement;