import Header from './Header';
import Footer from './Footer';
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './AccountPage.css';

const AccountPage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const response = await fetch('https://gkk8zqlh8h.execute-api.eu-west-2.amazonaws.com/dep/get-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setName(data.name || '');
        setPhoneNumber(data.phoneNumber || '');
        setEmail(data.email || '');
        setDescription(data.description || '');
        setProfilePicture(data.profilePictureUrl || '');
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const response = await fetch('https://gkk8zqlh8h.execute-api.eu-west-2.amazonaws.com/dep/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, phoneNumber, description, profilePicture }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated user data:", data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setProfilePicture(base64String);
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="account">
      <Header />
  <h2>Profile <span className="user-name">Info</span></h2>
  <div className="profile-section">
    <div className="profile-picture">
      <img 
        src={profilePicture ? profilePicture : "data:image/png;base64,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"} 
        alt="Profile" 
      />
      {isEditing && (
        <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
      )}
    </div>
    <div className="profile-info">
      {isEditing ? (
        <>
          <div className="profile-info-item">
            <label>
              <strong>Name:</strong>
              <input 
                type="text" 
                value={name} 
                onChange={handleInputChange(setName)} 
                className="modern-input"
              />
            </label>
          </div>
          <div className="profile-info-item">
            <label>
              <strong>Email:</strong>
              <input 
                type="email" 
                value={email} 
                onChange={handleInputChange(setEmail)} 
                className="modern-input"
              />
            </label>
          </div>
          <div className="profile-info-item">
            <label>
              <strong>Phone Number:</strong>
              <input 
                type="tel" 
                value={phoneNumber} 
                onChange={handleInputChange(setPhoneNumber)} 
                className="modern-input"
              />
            </label>
          </div>
          <div className="profile-info-item">
            <label>
              <strong>Description:</strong>
              <textarea 
                value={description} 
                onChange={handleInputChange(setDescription)}
                className="modern-textarea"
              />
            </label>
          </div>
          <button className="edit-button" onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <div className="profile-info-item">
            <p><strong>Name:</strong> {name}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Email:</strong> {email}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Phone Number:</strong> {phoneNumber}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Description:</strong> {description}</p>
          </div>
        </>
      )}
      <button className="edit-button" onClick={handleEditToggle}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
    </div>
  </div>
</div>
  );
};

export default AccountPage;