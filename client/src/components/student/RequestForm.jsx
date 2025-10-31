import { useEffect, useState } from 'react';
import { createRequest, getAllCategories } from '../../services/api';

const RequestForm = ({ onNewRequest }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [points, setPoints] = useState('');
  const [proof, setProof] = useState(null);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the pre-defined categories when the component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getAllCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0].name); // Set a default category
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setMessage("Could not load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proof) {
      setMessage('Please select a proof file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('points', points);
    formData.append('proof', proof);

    try {
      await createRequest(formData);
      setMessage('Request submitted successfully!');
      // Reset form fields
      setTitle('');
      setPoints('');
      setProof(null);
      if (categories.length > 0) setCategory(categories[0].name);
      e.target.reset(); // Clear the file input visually
      onNewRequest(); // Refresh the list in the parent component
    } catch (error) {
      // Display the specific error from the backend
      setMessage(error.response?.data?.message || 'Submission failed. Please try again.');
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading form...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <p className={message.includes('failed') ? 'text-red-500' : 'text-green-500'}>{message}</p>}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Activity Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md"
        >
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points Claimed</label>
        <input
          type="number"
          id="points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="proof" className="block text-sm font-medium text-gray-700">Proof (PDF, JPG, PNG - Max 10MB)</label>
        <input
          type="file"
          id="proof"
          onChange={(e) => setProof(e.target.files[0])}
          accept=".pdf,.jpg,.jpeg,.png"
          required
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit Request
      </button>
    </form>
  );
};

export default RequestForm;