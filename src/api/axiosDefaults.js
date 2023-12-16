import axios from "axios";

axios.defaults.baseURL = "https://bjj-fcb7bcc1efc9.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;