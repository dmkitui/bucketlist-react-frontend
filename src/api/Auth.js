import axios from 'axios';

const headers = new Headers({ 'Content-Type': 'application/json' });
const baseUrl = 'https://flask-api-bucketlist.herokuapp.com/api/v1/bucketlists/';  // 'http://127.0.0.1:5000/api/v1/bucketlists/';  //

let optionsGenerator = () => {
  let token = localStorage.getItem('token');
  let user_token = 'Bearer ' + token;
  return { headers: { 'Content-Type': 'application/json', 'Authorization': user_token } };
};

let AuthAPI = {
  getBucketlists() {
    let options = optionsGenerator();
    return axios.get(baseUrl, options);
  },

  login(email, password) {
    const loginUrl = 'https://flask-api-bucketlist.herokuapp.com/api/v1/auth/login'; // 'http://127.0.0.1:5000/api/v1/auth/login'; //
    let body = {'user_email': email, 'user_password': password};
    return axios.post(loginUrl, body, headers);
  },
  deleteBucketlist(id) {
    const deleteUrl = baseUrl + parseInt(id, 10);
    return axios.delete(deleteUrl, optionsGenerator());
  },
  editBucketlistTitle(id, newTitle) {
    const editBucketlistUrl = baseUrl + id;
    const body = { 'name': newTitle };
    return axios.put(editBucketlistUrl, body, optionsGenerator());
  },
  newBucketlist(title) {
    let body = { 'name': title };
    return axios.post(baseUrl, body, optionsGenerator());
  },
  addItem(id, item_name){
    const addItemUrl = baseUrl + id + '/items/';
    const body = { 'item_name': item_name };
    return axios.post(addItemUrl, body, optionsGenerator());
  },
  updateUserAvatar(url) {
    const updateUrl = 'https://flask-api-bucketlist.herokuapp.com/api/v1/auth/update';  // 'http://127.0.0.1:5000/api/v1/auth/update';
    const body = { 'avatar_url': url };
    return axios.post(updateUrl, body, optionsGenerator());
  },
  updateUsername(username) {
    const updateUrl = 'https://flask-api-bucketlist.herokuapp.com/api/v1/auth/update';  // 'http://127.0.0.1:5000/api/v1/auth/update';
    const body = { 'username': username };
    return axios.post(updateUrl, body, optionsGenerator());
  },
};
export default AuthAPI;

