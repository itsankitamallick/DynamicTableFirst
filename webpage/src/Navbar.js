import React from 'react';

const Navbar = ({ onBoldClick, onItalicClick, onUnderlineClick }) => {
  return (
    <div className="navbar">
      <button onClick={onBoldClick}>B</button>
      <button onClick={onItalicClick}>I</button>
      <button onClick={onUnderlineClick}>U</button>
    </div>
  );
};

export default Navbar;