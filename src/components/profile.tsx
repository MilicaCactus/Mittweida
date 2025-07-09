import React from 'react';
import './profile.css'; // Make sure you create this CSS file

const Profile: React.FC = () => {
    return (
        <div className="profile-container">
            <div className="header">
                <div className="profile-pic">
                    <img src="your-cat-image.jpg" alt="Profile" />
                </div>
                <div className="name">Your Name</div>
            </div>

            <div className="bio-box">
                About you info or some bio
            </div>

            <div className="icon-bar">
                <span className="icon" role="img" aria-label="document">📄</span>
                <span className="icon" role="img" aria-label="bookmark">🔖</span>
                <span className="icon" role="img" aria-label="notebook">📝</span>
            </div>

            <div className="card-list">
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
            </div>
        </div>
    );
};

export default Profile;
