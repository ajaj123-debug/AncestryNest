import React from 'react';
import logo from '../assets/logo.png'; // Add this import

const Landing = () => {
  return (
    <div>
      {/* ...existing JSX... */}
      <img src={logo} alt="Logo" /> {/* Replace 'FamilyTreeMaker' text with this */}
      {/* ...existing JSX... */}
    </div>
  );
};

export default Landing;