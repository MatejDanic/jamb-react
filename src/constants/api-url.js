// const API_URL = "https://jamb-spring.herokuapp.com";
const API_URL = process.env.API_URL ? process.env.API_URL: "https://jamb-spring.herokuapp.com";
export default API_URL;