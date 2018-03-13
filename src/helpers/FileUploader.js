import React, { Component } from 'react';
import './common-styles.css';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import ModalDialogs from './Dialogs';

class FileUploader extends Component {
  
  constructor (props) {
    super(props);
    this.state =({
      avatarUrl: '',
      uploading: false,
      percentage: 0
    });
    this.onProgress = this.onProgress.bind(this);
  }
  onProgress(e) {
    let value = Math.floor(e.percent);
    console.log('% Done: ', value)
    if(value > 0) {
      this.setState({
        uploading: true,
        percentage: value
      })
      this.props.status(value)
    } else if(value === 100){
      console.log('Uploading Done!')
      this.setState({
        uploading: false
      });
    }
  }

  handleRes(res) {
    const CLOUDINARY_UPLOAD_PRESET = 'rqnmb3df';
    const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/alphadog/image/upload';
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('file', res[0]);
    upload.on('progress', this.onProgress);
    upload.end((err, response) => {
      if (err) {
        console.error('Upload ERROR: ', err);
        ModalDialogs.error('Error Uploading Your Avatar. Try Again')
      }

      if (response.body.secure_url !== '') {
        console.log('RESPONSE URL: ', response.body.secure_url)
        this.setState({
          avatarUrl: response.body.secure_url
        });
      }
      this.props.onUpload(this.state.avatarUrl);
    });
  }
  
  errorHandler(res) {
    console.log('ERROR: ', res)
    ModalDialogs.error('Error Uploading Your Avatar. Try Again')
  }
  render() {
    return(
      <Dropzone
        className="dropZone"
        multiple={false}
        text="Change"
        accept="image/*"
        onDrop={this.handleRes.bind(this)}>
        <div>Change</div>
      </Dropzone>
    );
  }
}
export default FileUploader