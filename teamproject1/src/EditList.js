import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

export default function EditList({ name, friend }) {
  const [formData, setFormData] = useState({
    id: '',
    Firstname: '',
    Lastname: '',
    Location: '',
    Age: '',
    MBTI: 'ISFP',
    PreferredWeather: 'Sunny',
    Gender: 'Male',
  });

  // Load friend data into the form when edit button is clicked
  useEffect(() => {
    if (friend) {
      setFormData(friend);
    }
    
  }, [friend]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Clear form data
  const clearForm = () => {
    setFormData({
      id: '',
      Firstname: '',
      Lastname: '',
      Location: '',
      Age: '',
      MBTI: 'ISFP',
      PreferredWeather: 'Sunny',
      Gender: 'Male',
    });
  };

  // Update data using PUT
  const updateData = async () => {
    try {
      const response = await axios.put(
        `https://674d0abe54e1fca9290e27b0.mockapi.io/favorites/favorites/${formData.id}`,
        formData,
        { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
      );
      if (response.status === 200) {
        alert('Update successful');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update data.');
    }
  };

  // Delete data
  const deleteData = async () => {
    try {
      const response = await axios.delete(
        `https://674d0abe54e1fca9290e27b0.mockapi.io/favorites/favorites/${formData.id}`
      );
      if (response.status === 200) {
        alert('Delete successful');
        clearForm();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Failed to delete data.');
    }
  };

  return (
    <>
      <div className="editList">
      <button
        id="editData"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#editModal"
      >
        Edit
      </button>
      </div>
      

      <div className="modal" id="editModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={clearForm}
              ></button>
            </div>

            <div className="modal-body">
              <div id="inputDiv">
                First name: <input type="text" name="Firstname" value={formData.Firstname} onChange={handleInputChange} /><br />
                Last name: <input type="text" name="Lastname" value={formData.Lastname} onChange={handleInputChange} /><br />
                Location: <input type="text" name="Location" value={formData.Location} onChange={handleInputChange} /><br />
                Gender: <span> </span>
                <input
                  type="radio"
                  name="Gender"
                  value="Male"
                  checked={formData.Gender === 'Male'}
                  onChange={handleInputChange}
                />
                <label> Male </label><span> </span>
                <input
                  type="radio"
                  name="Gender"
                  value="Female"
                  checked={formData.Gender === 'Female'}
                  onChange={handleInputChange}
                />
                <label> Female </label><br />
                Age: <input type="text" name="Age" value={formData.Age} onChange={handleInputChange} /><br />
                MBTI: <span> </span>
                <select name="MBTI" value={formData.MBTI} onChange={handleInputChange}>
                  <option value="ISFP">ISFP</option>
                  <option value="ISTP">ISTP</option>
                  <option value="INFJ">INFJ</option>
                  <option value="INFP">INFP</option>
                  <option value="ESTP">ESTP</option>
                  <option value="ENTJ">ENTJ</option>
                  <option value="ISFJ">ISFJ</option>
                  <option value="INTP">INTP</option>
                  <option value="ISTJ">ISTJ</option>
                  <option value="INTJ">INTJ</option>
                  <option value="ENFP">ENFP</option>
                  <option value="ENFJ">ENFJ</option>
                  <option value="ESFP">ESFP</option>
                  <option value="ESFJ">ESFJ</option>
                  <option value="ENTP">ENTP</option>
                  <option value="ESTJ">ESTJ</option>
                </select><br />
                Preferred Weather: <span> </span>
                <select name="PreferredWeather" value={formData.PreferredWeather} onChange={handleInputChange}>
                  <option value="Sunny">Sunny</option>
                  <option value="Warm">Warm</option>
                  <option value="Cloudy">Cloudy</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Snowy">Snowy</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success btn-sm"
                data-bs-dismiss="modal"
                onClick={updateData}
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                data-bs-dismiss="modal"
                onClick={deleteData}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
                onClick={clearForm}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
