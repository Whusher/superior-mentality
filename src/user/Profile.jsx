import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLA from "../layouts/ContentLA";
import './profile.css';
import { useAuth } from "../context/AuthContext";

import pencil from '../assets/pencil.png';
import photo1 from '../assets/1ip.png';
import photo2 from '../assets/2ip.png';
import photo3 from '../assets/3ip.png';
import photo4 from '../assets/4ip.png';
import photo5 from '../assets/5ip.png';
import photo6 from '../assets/6ip.png';
import photo7 from '../assets/7ip.png';
import photo8 from '../assets/8ip.png';
import photo9 from '../assets/9ip.png';
import { ProfileEndpoint } from '../utils/EndpointExporter';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});

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
    const fetchUser = async () => {
      const token = localStorage.getItem('userToken'); 

      try {
        const response = await fetch(`${ProfileEndpoint}?token=${token}`, { method: 'GET' });

        if (!response.ok) {
          throw new Error('Unable to fetch profile.');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUser();
  }, [navigate]);
  const profilePhoto = imagesMap[profileData?.profile_image_id];

  

  return (
    <div className="profile-container">
      <div className="profile-header" style={{ position: 'relative' }}>
        <img src={profilePhoto || photo1} alt="profilePhoto" className="profile-image" />
        <img
          src={pencil}
          alt="edit"
          className="edit-icon"
          onClick={() => navigate('/editProfileImage')}
        />
        <h1 className="profile-name">{user.name || 'No name available'}</h1>
      </div>

      <div className="profile-info">
        <div className="profile-info-item" style={{ position: 'relative' }}>
          <h2 className="profile-title">Email:</h2>
          <p className="profile-text">{user.email || 'No email available'}</p>
        </div>
        <div className="profile-info-item" style={{ position: 'relative' }}>
          <h2 className="profile-title">Interests:</h2>
          <p className="profile-text">
            {profileData?.interests?.length > 0 ? profileData?.interests.join(", ") : 'No interests available'}
          </p>
          <img
            src={pencil}
            alt="edit"
            className="edit-icon"
            onClick={() => navigate('/editProfilePreferences')}
          />
        </div>
        <div className="profile-info-item" style={{ position: 'relative' }}>
          <h2 className="profile-title">Favorite colors:</h2>
          <p className="profile-text">
            {profileData?.favoriteColors?.length > 0 ? profileData?.favoriteColors.join(", ") : 'No favorite colors available'}
          </p>
          <img
            src={pencil}
            alt="edit"
            className="edit-icon"
            onClick={() => navigate('/editProfileColors')}
          />
        </div>
        <div className="profile-info-item" style={{ position: 'relative' }}>
          <h2 className="profile-title">Favorite music:</h2>
          <p className="profile-text">
            {profileData?.favoriteMusic?.length > 0 ? profileData?.favoriteMusic.join(", ") : 'No favorite music available'}
          </p>
          <img
            src={pencil}
            alt="edit"
            className="edit-icon"
            onClick={() => navigate('/editProfileMusic')}
          />
        </div>
      </div>

      <div className="profile-buttons">
        <button className="profile-button back" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default function ViewProfile() {
  return <ContentLA child={<Profile />} />;
}
