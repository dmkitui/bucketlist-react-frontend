import moment from 'moment';
import decode from 'jwt-decode';
import ModalDialogs from './Dialogs';

const Helpers = {
  dateTimeFormat(timeObj) {
    const time = new Date(`${timeObj} UTC`);
    return moment(time.getTime()).format('MMM Do YYYY, [at] h:mm[ ]a');
  },
  isTokenValid() {
    const token = localStorage.getItem('token');
    try {
      const decoded = decode(token);
      return (decoded.exp > (Date.now() / 1000))
    } catch (error) {
      ModalDialogs.error('You are not logged in. Log in first.');
      return false;
    }
  },
};

export default Helpers;
