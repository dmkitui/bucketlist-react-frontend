import swal from 'sweetalert';
import './Dialog.css';


const ModalDialogs = {

  success(text) {
    return swal({
      title: 'SUCCESS',
      icon: 'success',
      text,
      timer: 3000,
    });
  },
  error(text) {
    return swal({
      title: 'ERROR',
      icon: 'error',
      text,
    });
  },
  errorStatus(text) {
    return swal({
      title: 'ERROR',
      icon: 'error',
      text,
      timer: 3000,
    });
  },
  prompt(obj) {
    return swal({
      closeOnClickOutside: false,
      closeOnEsc: false,
      title: obj.title,
      text: obj.text ? obj.text : null,
      icon: obj.icon ? obj.icon : 'info',
      content: obj.content ? obj.content : null,
      buttons: {
        cancel: obj.cancel ? obj.cancel : true,
        confirm: {
          text: obj.ok ? obj.ok : 'OK',
          closeModal: false,
          className: 'confirm-btn',
        },
      },
      dangerMode: obj.dangerMode ? obj.dangerMode : false,
    });
  },
};
export default ModalDialogs;
