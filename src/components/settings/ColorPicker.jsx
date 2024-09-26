// ColorPicker.jsx

import React, { useState } from 'react';

const ColorPicker = ({ initialColor, onCancel, onOk }) => {
  const [customColor, setCustomColor] = useState(initialColor);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const changeCustomColor = (newColor) => {
    setCustomColor(newColor);
  };

  const handleOk = () => {
    setSelectedColor(customColor);
    onOk(customColor); // Pass selected color to parent component
  };

  const handleCancel = () => {
    setCustomColor(selectedColor); // Reset to previously selected color
    onCancel();
  };

  return (
    <div>
      <input
        type="color"
        value={customColor}
        onChange={(e) => changeCustomColor(e.target.value)}
      />
      <span>Selected color: {customColor}</span>
      <div>
        <button onClick={handleOk}>OK</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ColorPicker;
