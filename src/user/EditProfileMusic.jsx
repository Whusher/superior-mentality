import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLA from "../layouts/ContentLA";
import './profile.css';
import { OptionsMusicEndpoint, MusicEndpoint } from '../utils/EndpointExporter';

const EditProfileMusic = () => {
  
  const [musicOptions, setMusicOptions] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const musicRes = await fetch(OptionsMusicEndpoint); 
        const musicData = await musicRes.json();

        setMusicOptions(musicData);
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
    console.log(token);
    
    try {
      const response = await fetch(`${MusicEndpoint}?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genres: selectedMusic 
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

      {/* Favorite Music */}
      <div className="form-group">
        <label>Favorite Music:</label>
        <div className="checkbox-group">
          {musicOptions.map(genre => (
            <div
              key={genre.id_genre}
              className={`checkbox-label ${selectedMusic.includes(genre.id_genre) ? 'selected' : ''}`}
              onClick={() => handleSelectionChange(genre.id_genre, setSelectedMusic, selectedMusic)}
            >
              {genre.genre}
            </div>
          ))}
        </div>
      </div>

      <button className="profile-button save" onClick={handleSaveChanges}>Save Changes</button>
      <button className="profile-button cancel" onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default function ViewEditProfileMusic() {
  return <ContentLA child={<EditProfileMusic />} />;
}
