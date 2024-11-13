import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLA from "../layouts/ContentLA";
import './profile.css';
import { OptionsColorsEndpoint, ColorsEndpoint } from '../utils/EndpointExporter';

const EditProfileColors = () => {
  const [colorOptions, setColorOptions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const colorsRes = await fetch(OptionsColorsEndpoint);
        const colorsData = await colorsRes.json();
        setColorOptions(colorsData);
      } catch (error) {
        console.error('Error loading options:', error);
        alert('Error loading options. Please try again.');
      }
    };

    fetchOptions();
  }, []);

  const handleSelectionChange = (value, setSelected, selected) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(item => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('userToken'); 
    
    try {
      const response = await fetch(`${ColorsEndpoint}?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colors: selectedColors, // Cambiado a "colors"
        }),
      });
  
      if (!response.ok) throw new Error('Error updating preferences.');
      alert('Preferences updated successfully.');
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
        <label>Favorite Colors:</label>
        <div className="checkbox-group">
          {colorOptions.map(color => (
            <div
              key={color.id_color}
              className={`checkbox-label ${selectedColors.includes(color.id_color) ? 'selected' : ''}`}
              onClick={() => handleSelectionChange(color.id_color, setSelectedColors, selectedColors)}
            >
              {color.color}
            </div>
          ))}
        </div>
      </div>
      <button className="profile-button save" onClick={handleSaveChanges}>Save Changes</button>
      <button className="profile-button cancel" onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default function ViewEditProfileColors() {
  return <ContentLA child={<EditProfileColors />} />;
}
