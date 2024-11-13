import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLA from "../layouts/ContentLA";
import './profile.css';
import { PreferencesEndpoint, OptionsPreferencesEndpoint } from '../utils/EndpointExporter';

const EditProfilePreferences = () => {
  const [preferenceOptions, setPreferenceOptions] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const preferencesRes = await fetch(OptionsPreferencesEndpoint); // Use endpoint from `endpointexporter.jsx`
        const preferencesData = await preferencesRes.json();

        setPreferenceOptions(preferencesData);
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
    
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      
      const response = await fetch(`${PreferencesEndpoint}?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: selectedPreferences,
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
        <label>Preferences:</label>
        <div className="checkbox-group">
          {preferenceOptions.map(preference => (
            <div
              key={preference.id_preference}
              className={`checkbox-label ${selectedPreferences.includes(preference.id_preference) ? 'selected' : ''}`}
              onClick={() => handleSelectionChange(preference.id_preference, setSelectedPreferences, selectedPreferences)}
            >
              {preference.preference}
            </div>
          ))}
        </div>
      </div>

      <button className="profile-button save" onClick={handleSaveChanges}>Save Changes</button>
      <button className="profile-button cancel" onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default function ViewEditProfilePreferences() {
  return <ContentLA child={<EditProfilePreferences />} />;
}
