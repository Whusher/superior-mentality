import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLA from "../layouts/ContentLA";
import './profile.css';
import { OptionsMusicEndpoint, MusicEndpoint } from '../utils/EndpointExporter';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfileMusic = () => {
  const [musicOptions, setMusicOptions] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const musicRes = await fetch(`${OptionsMusicEndpoint}?token=${token}`);
        const musicData = await musicRes.json();
        setMusicOptions(musicData);
      } catch (error) {
        console.error('Error loading options:', error);
        toast.error('Error loading music options. Please try again.');
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
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${MusicEndpoint}?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genres: selectedMusic,
        }),
      });

      if (!response.ok) throw new Error('Error updating preferences.');
      toast.success('Music preferences updated successfully.');
      navigate('/profile');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Error saving preferences. Please try again.');
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
