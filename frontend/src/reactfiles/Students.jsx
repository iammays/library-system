import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssfiles/Students.css';

function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentId, setStudentId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', studentId: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchStudents(token);
  }, [navigate]);

  const fetchStudents = (token) => {
    fetch('/api/students', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => setStudents(data))
    .catch(error => console.error('Error fetching students:', error));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddStudentClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    fetch('/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(newStudent)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => { throw new Error(data.message) });
      }
      return response.json();
    })
    .then(data => {
      setStudents([...students, data]);
      setShowModal(false);
      setNewStudent({ name: '', studentId: '' });
      fetchStudents(token); // Re-fetch students to ensure the list is up-to-date
    })
    .catch(error => {
      setErrorMessage(error.message);
    });
  };

  const filteredStudents = students.filter(student => {
    return (
      (searchTerm === '' || student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentId.includes(searchTerm))
    );
  });

  return (
    <div className="students-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or student ID"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="add-student-button" onClick={handleAddStudentClick}>Add Student +</button>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.studentId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Add New Student</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={newStudent.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="studentId">Student ID:</label>
                <input type="text" id="studentId" name="studentId" value={newStudent.studentId} onChange={handleInputChange} required />
              </div>
              <button type="submit">Add Student</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
