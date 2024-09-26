import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { Button, Select } from 'antd';
import './../utils/App.less'; // Ensure you import your less file
import '../../global.css';
import userConfigManager from '../configuration/userConfigManager';

const { Option } = Select;

const Settings = () => {
  const initialColors = userConfigManager.getConfig('appColors');

  const getStoredColors = () => {
    //const storedColors = sessionStorage.getItem('userConfig');
    const storedColors = userConfigManager.getConfig('appColors');
    return storedColors ? storedColors : initialColors;
  };

  const [colorType, setColorType] = useState('primary-color');
  const [tempColor, setTempColor] = useState(getStoredColors()['primary-color']);
  const [colors, setColors] = useState(getStoredColors());

  useEffect(() => {
    Object.keys(colors).forEach((key) => {
      changeColorVariable(key, colors[key]);
    });
    //sessionStorage.setItem('appColors', JSON.stringify(colors));
    userConfigManager.setConfig('appColors',colors);
  }, [colors]);

  const handleChangeComplete = (color) => {
    setTempColor(color.hex);
  };

  const handleOkClick = () => {
    setColors((prevColors) => {
      const newColors = {
        ...prevColors,
        [colorType]: tempColor,
        ...(colorType === 'background-color' && {
          'menu-background-color': tempColor,
          'layout-sider-color': tempColor,
        }),
      };
      Object.keys(newColors).forEach((key) => {
        changeColorVariable(key, newColors[key]);
      });
      return newColors;
    });
  };

  const changeColorVariable = (type, color) => {
    document.documentElement.style.setProperty(`--${type}`, color);
    console.log(`Changing ${type} to ${color}`);
  };

  const handleSetDefaultColors = () => {
    setColors(initialColors);
    setTempColor(initialColors[colorType]); // Reset tempColor to the initial color of the currently selected type
    console.log("Default colors applied:", initialColors);
  };

  return (
    <div>
      <h2>Choose your theme color:</h2>
      <Select
        defaultValue="primary-color"
        style={{ width: 200, marginBottom: '16px' }}
        onChange={(value) => {
          setColorType(value);
          setTempColor(colors[value]); // Update tempColor when the selected color type changes
        }}
      >
        <Option value="primary-color">Menu Item Color</Option>
        <Option value="background-color">Background Color</Option>
        <Option value="text-color">Text Color</Option>
        <Option value="secondary-color">Secondary Color</Option>
        <Option value="header-background-color">Header Background Color</Option>
        <Option value="button-color">Button Color</Option>
      </Select>
      <SketchPicker color={tempColor} onChangeComplete={handleChangeComplete} />
      <Button type="primary" style={{ marginTop: '16px', marginRight: '8px' }} onClick={handleOkClick}>
        OK
      </Button>
      <Button onClick={handleSetDefaultColors}>Set Default Colors</Button>
    </div>
  );
};

export default Settings;
