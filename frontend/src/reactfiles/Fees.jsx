import React, { useState, useEffect } from 'react';
import '../cssfiles/Fees.css';

const Fees = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    const token = localStorage.getItem('accessToken');
    fetch('/api/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log('Fetched students:', data); // Ensure this includes subscriptionEndDate and isPaid
      setStudents(data);
    })
    .catch(err => console.error('Error fetching students:', err));
  };
  
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUpdateSubscription = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
  
    fetch(`/api/subscriptions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ studentId: selectedStudentId, paymentAmount: amount }) 
    })
    .then(res => res.json())
    .then(data => {
      console.log('Update response:', data); // إضافة هذا السطر
      setMessage(data.message);
      setShowModal(false);
      fetchStudents(); // إعادة جلب البيانات
    })
    .catch(err => console.error('Error updating subscription:', err));
    
  };
  

//console.log('Updating subscription for studentId:', selectedStudentId, 'with amount:', amount);


const handleOpenModal = (studentId) => {
  setSelectedStudentId(studentId); 
  setShowModal(true);
};

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="fees-page">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search students..." 
          value={searchTerm} 
          onChange={handleSearch} 
        />
        {/* <button className="add-payment-button" onClick={() => handleOpenModal('')}>Add Payment +</button> */}
      </div>
      <table className="students-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Subscription End Date</th>
            <th>Payment Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.includes(searchTerm)
  ).map(student => (
    <tr key={student._id}>
      <td>{student.studentId}</td>
      <td>{student.name}</td>
      <td>{student.subscriptionEndDate ? new Date(student.subscriptionEndDate).toLocaleDateString() : 'N/A'}</td>
      <td>{student.isPaid ? 'Paid' : 'Unpaid'}</td>
      <td>
        <button onClick={() => handleOpenModal(student.studentId)}>Update</button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Update Payment</h2>
            <form onSubmit={handleUpdateSubscription}>
              <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input 
                  type="number" 
                  id="amount" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Fees;
