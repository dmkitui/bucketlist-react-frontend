import React, { Component } from 'react';
import swal from 'sweetalert';
import './header.css';
import ModalDialogs from '../../helpers/Dialogs';
import AuthAPI from '../../api/Auth';
import FileUploader from '../../helpers/FileUploader';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarHover: false,
      user: this.props.user,
      uploading: 0,
    };
    this.updateAvatar = this.updateAvatar.bind(this);
    this.uploadingStatus = this.uploadingStatus.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    console.log('Mounted USER Header: ', nextProps.user);
    this.setState({
      user: nextProps.user,
    });
  }
  updateAvatar(url) {
    const user = this.state.user;
    user.avatarUrl = url;
    this.setState({
      user,
    });
    console.log('Fresh User: ', user);
    AuthAPI.updateUserAvatar(url)
      .then((res) => {
        if (res.status === 201) {
          localStorage.setItem('user', JSON.stringify(this.state.user));
          ModalDialogs.success('You Changed Your Avatar Successfully');
        }
      })
      .catch((error) => {
        console.log('Save Avatar Error: ', error);
        ModalDialogs.error('Some Error Occurred.');
      });
    console.log('Updated User: ', this.state.user);
  }
  uploadingStatus(val) {
    if (val) {
      this.setState({
        uploading: val,
      });
    }
  }
  updateUsername(e) {
    console.log('Update username');
    ModalDialogs.prompt({
      title: 'Update Username',
      text: 'Choose a super Unique username',
      content: { element: 'input', attributes: { placeholder: 'Username', type: 'text' } },
      ok: 'Update',
    }).then((username) => {
      AuthAPI.updateUsername(username)
        .then((res) => {
          console.log('Username Update: ', res);
        })
        .catch((error) => {
          console.log('Username Error: ', error);
        });
    }).catch((error) => {
      console.log('Errors: ', error);
    });
    e.stopPropagation();
  }

  logoutUser(e) {
    swal({
      title: 'Log Out?',
      text: 'Are you sure you wann go?',
      icon: 'warning',
      buttons: {
        cancel: true,
        ok: {
          text: 'Log Out',
          closeModal: false,
        },
      },
      dangerMode: true,
    }).then((logOut) => {
      if (logOut) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.props.logout(false);
        swal('Logged Out Successfully', {
          icon: 'success',
          timer: 3000,
        });
      }
    });
  }

  render() {
    if (this.props.logStatus) {
      return (
        <div className="container">
          <div className="row userBox">
            <div className=" col-5">
              <div className="avatar" onMouseOver={() => this.setState({ avatarHover: true })} onMouseOut={() => this.setState({ avatarHover: false })}>
                <div hidden={!this.state.avatarHover}>
                  <FileUploader onUpload={this.updateAvatar} status={this.uploadingStatus} />
                </div>
                <div className="dropZone progress-text" hidden={!this.state.uploading || (this.state.uploading === 100)}>{this.state.uploading}%</div>
                <img src={this.state.user.avatarUrl} alt="User Pic" />
              </div>
            </div>
            <div className="''col-7">
              <div className="user-data">
                <table>
                  <tbody>
                    <tr>
                      <td>{this.state.user.username ? this.state.user.username : <button onClick={event => this.updateUsername(event)} className="username-button">Set Username</button>}</td>
                    </tr>
                    <tr>
                      <td>{this.state.user.email}</td>
                    </tr>
                    <tr className="logout-btn-holder">
                      <td><button className="btn logout-btn" onClick={event => this.logoutUser(event)}>Log Out</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div />
    );
  }
}

class ActionButton extends Component {
  constructor(props) {
    super(props);
  }
  newBucketlist(e) {
    ModalDialogs.prompt({
      title: 'Add Item Bucketlist',
      content: { element: 'input', attributes: { placeholder: 'New Item', type: 'text' } },
      ok: 'Create',
    })
      .then((value) => {
        if (value !== '') {
          AuthAPI.newBucketlist(value)
            .then((res) => {
              if (res.status === 201) {
                ModalDialogs.success('New Bucketlist Created Successfully.');
              }
            })
            .catch((error) => {
              if (error.response !== undefined) {
                ModalDialogs.error(error.response.data.message);
              } else {
                ModalDialogs.error(error.message);
              }
            });
        } else {
          ModalDialogs.error('New bucketlist can not be blank!');
        }
      })
      .catch();
    e.stopPropagation();
  }
  render() {
    if (this.props.logStatus) {
      return (
        <button className="new-button" onClick={event => this.newBucketlist(event)}>New Bucketlist</button>
      );
    }
    return [];
  }
}

const Titlebox = props => (
  <div className="titleBox">
    <h2>Bucketlist Online Service</h2>
    <h4>Just Do It, Someday!</h4>
  </div>
);

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user,
      loggedIn: nextProps.loggedIn
    });
  }
  render() {
    return (
      <div className="row topBannner">
        <div className="col-3 banner-sect">
          <User logStatus={this.state.loggedIn} user={this.state.user} />
        </div>
        <div className="col-6 banner-sect">
          <Titlebox />
        </div>
        <div className="col-3 banner-sect">
          <ActionButton logStatus={this.props.loggedIn} />
        </div>
      </div>
    );
  }
}
export default Header;
