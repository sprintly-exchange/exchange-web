// src/utils/authUtils.js
import { jwtDecode } from 'jwt-decode';

const verifyToken = (token) => {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  return decodedToken;
};

export default verifyToken;
