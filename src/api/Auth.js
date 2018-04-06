import axios from 'axios';

const axiosBucketlistManipulations = axios.create({
  baseURL: 'https://flask-api-bucketlist.herokuapp.com/api/v1/bucketlists/',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
});

const axiosUpdateProfile = axios.create({
  baseURL: 'https://flask-api-bucketlist.herokuapp.com/api/v1/auth/update',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
});
const AuthAPI = {
  getBucketlists() {
    const url = '?limit=100';
    return axiosBucketlistManipulations.get(url);
  },
  login(email, password) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const loginUrl = 'https://flask-api-bucketlist.herokuapp.com/api/v1/auth/login'; // 'http://127.0.0.1:5000/api/v1/auth/login'; //
    const body = { user_email: email, user_password: password };
    return axios.post(loginUrl, body, headers);
  },
  deleteBucketlist(id) {
    const deleteUrl = parseInt(id, 10);
    return axiosBucketlistManipulations.delete(deleteUrl.toString());
  },
  editBucketlistTitle(id, newTitle) {
    const editUrl = parseInt(id, 10);
    return axiosBucketlistManipulations.put(editUrl.toString(), { name: newTitle });
  },
  newBucketlist(title) {
    return axiosBucketlistManipulations.post('', { name: title });
  },
  addItem(id, itemName) {
    const addItemUrl = `${parseInt(id, 10)}/items/`;
    return axiosBucketlistManipulations.post(addItemUrl, { item_name: itemName });
  },
  updateUserAvatar(url) {
    return axiosUpdateProfile.post('', { avatar_url: url });
  },
  updateUsername(username) {
    return axiosUpdateProfile.post('', { username });
  },
  completeItem(itemId, bucketlistId) {
    const url = `${parseInt(bucketlistId, 10)}/items/${parseInt(itemId, 10)}`;
    return axiosBucketlistManipulations.put(url, { done: true });
  },
  editItemName(itemId, bucketlistId, newName) {
    const url = `${parseInt(bucketlistId, 10)}/items/${parseInt(itemId, 10)}`;
    return axiosBucketlistManipulations.put(url, { item_name: newName });
  },
  search(searchTerms) {
    const url = `?q=${searchTerms}`;
    return axiosBucketlistManipulations.get(url);
  },
};
export default AuthAPI;

