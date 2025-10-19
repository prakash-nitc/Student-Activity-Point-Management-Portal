import { useState } from 'react';
import { createRequest } from '../../services/api';

const RequestForm = ({ onNewRequest }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [points, setPoints] = useState('');
  const [proof, setProof] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('points', points);
    formData.append('proof', proof);

    try {
      await createRequest(formData);
      setMessage('Request submitted successfully!');
      setTitle(''); setCategory(''); setPoints(''); setProof(null);
      e.target.reset(); // Clear the file input
      onNewRequest();
    } catch (error) {
      setMessage('Submission failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <p>{message}</p>}
      <div className="form-group">
        <label>Activity Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Points Claimed:</label>
        <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Proof (PDF, JPG, PNG - Max 10MB):</label>
        <input type="file" onChange={(e) => setProof(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" required />
      </div>
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default RequestForm;