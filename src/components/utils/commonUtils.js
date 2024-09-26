import {message} from 'antd';
// Rendering the App component into the root div
export const applyStoredColors = () => {
    const storedColors = sessionStorage.getItem('appColors');
    if (storedColors) {
      const colors = JSON.parse(storedColors);
      Object.keys(colors).forEach((key) => {
        document.documentElement.style.setProperty(`--${key}`, colors[key]);
      });
    }
  };

  export const messageWarning = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      message.warning(error.response.data.message);
    } else {
      message.warning("An unexpected error occurred.");
    }
  };
  
  export const messageError = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      message.error(error.response.data.message);
    } else {
      message.error("An unexpected error occurred.");
    }
  };

  export const handleErrorResponse = (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      message.warning(error.response.data.message);
    } else {
        //message.info('Possibly no records found for current user.');
    }
  }

  export const camelCaseToWords = (str)  => {
    // Use a regular expression to find positions where a lowercase letter is followed by an uppercase letter
    return str.replace(/([a-z])([A-Z])/g, '$1 $2')
              // Convert the first letter of the string to uppercase (optional)
              .replace(/^./, function(match) { return match.toUpperCase(); });
  }