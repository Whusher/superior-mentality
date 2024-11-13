import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLA from "../layouts/ContentLA";
import './profile.css';
import { OptionsProfileImageEndpoint, ProfileImageEndpoint } from '../utils/EndpointExporter';

import photo1 from '../assets/1ip.png';
import photo2 from '../assets/2ip.png';
import photo3 from '../assets/3ip.png';
import photo4 from '../assets/4ip.png';
import photo5 from '../assets/5ip.png';
import photo6 from '../assets/6ip.png';
import photo7 from '../assets/7ip.png';
import photo8 from '../assets/8ip.png';
import photo9 from '../assets/9ip.png';

const EditProfileImage = () => {
  const [profileImages, setProfileImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const navigate = useNavigate();

  const imagesMap = {
    1: photo1,
    2: photo2,
    3: photo3,
    4: photo4,
    5: photo5,
    6: photo6,
    7: photo7,
    8: photo8,
    9: photo9,
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const imagesRes = await fetch(OptionsProfileImageEndpoint); 
        const imagesData = await imagesRes.json();
        console.log('Datos de las imágenes recibidas:', imagesData); 
        setProfileImages(imagesData);
      } catch (error) {
        console.error('Error loading options:', error);
        alert('Error loading options. Please try again.');
      }
    };

    fetchOptions();
  }, []);

  const handleImageSelection = (id) => {
    setSelectedImageId(id);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('userToken');
    
    console.log('Token:', token);
    
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await fetch(`${ProfileImageEndpoint}?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_profile_image: selectedImageId,
        }),
      });
  
      if (!response.ok) throw new Error('Error updating profile image.');
      alert('Profile image updated successfully.');
      navigate('/profile');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
  };
  

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      <div className="form-group">
        <label>Select Your Profile Image:</label>
        <div className="checkbox-group">
        {profileImages.map(image => (
  <div key={image.id_image} className="profile-image">
    <input
      type="radio"
      name="profileImage"
      value={image.id_image}
      checked={selectedImageId === image.id_image}
      onChange={() => handleImageSelection(image.id_image)}
    />
    <img src={imagesMap[image.id_image]} alt="Profile" />
  </div>
))}
        </div>
      </div>

      <button className="profile-button save" onClick={handleSaveChanges}>Save Changes</button>
      <button className="profile-button cancel" onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default function ViewEditProfileImage() {
  return <ContentLA child={<EditProfileImage />} />;
}
