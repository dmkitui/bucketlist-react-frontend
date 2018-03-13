import axios from 'axios';

const headers = new Headers({ 'Content-Type': 'application/json' });
const baseUrl = 'https://flask-api-bucketlist.herokuapp.com/api/v1/bucketlists/';  // 'http://127.0.0.1:5000/api/v1/bucketlists/';  //

let optionsGenerator = () => {
  let token = localStorage.getItem('token');
  let user_token = 'Bearer ' + token;
  return { headers: {'Content-Type': 'application/json', 'Authorization': user_token}};
}

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
    let options = optionsGenerator();
    return axios.delete(deleteUrl, options);
  },
  editBucketlistTitle(id, newTitle) {
    let editBucketlistUrl = baseUrl + id;
    let body = { 'name': newTitle };
    let options = optionsGenerator();
    return axios.put(editBucketlistUrl, body, options);
  },
  newBucketlist(title) {
    let options = optionsGenerator();
    let body = { 'name': title };
    
    return axios.post(baseUrl, body, options);
  },
  addItem(id, item_name){
    let options = optionsGenerator();
    let addItemUrl = baseUrl + id + '/items/';
    let body = { 'item_name': item_name };
    return axios.post(addItemUrl, body, options);
  },
  fetchBucketlist(id) {
    let options = optionsGenerator();
    let addItemUrl = baseUrl + id;
    return axios.get(baseUrl, options);
  },
  updateUserAvatar(url) {
    let options = optionsGenerator();
    let updateUrl = 'https://flask-api-bucketlist.herokuapp.com/api/v1/auth/update';  // 'http://127.0.0.1:5000/api/v1/auth/update';
    let body = { 'avatar_url': url };
    console.log('DB URL: ', url)
    return axios.post(updateUrl, body, options);
  },
  updateUsername(username) {
    let options = optionsGenerator();
    let updateUrl = 'https://flask-api-bucketlist.herokuapp.com/api/v1/auth/update';  // 'http://127.0.0.1:5000/api/v1/auth/update';
    let body = { 'username': username };
    return axios.post(updateUrl, body, options);
  }
};
export default AuthAPI;

