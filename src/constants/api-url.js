require('dotenv').config()

const BASE_URL = process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL: "http://localhost:8080";
export default BASE_URL;