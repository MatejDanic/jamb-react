// const BASE_URL = "https://jamb-spring.herokuapp.com";
const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL: "http://localhost:8080";
export default BASE_URL;