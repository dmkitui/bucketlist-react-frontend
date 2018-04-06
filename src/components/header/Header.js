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
    AuthAPI.updateUserAvatar(url)
      .then((res) => {
        if (res.status === 201) {
          localStorage.setItem('user', JSON.stringify(this.state.user));
          ModalDialogs.success('You Changed Your Avatar Successfully');
        }
      })
      .catch((error) => {
        ModalDialogs.error('Some Error Occurred.');
      });
  }
  uploadingStatus(val) {
    if (val) {
      this.setState({
        uploading: val,
      });
    }
  }
  updateUsername(e) {
    ModalDialogs.prompt({
      title: 'Update Username',
      text: 'Choose a super Unique username',
      content: { element: 'input', attributes: { placeholder: 'Username', type: 'text' } },
      ok: 'Update',
    }).then((username) => {
      AuthAPI.updateUsername(username)
        .then((res) => {
        console.log('RES: ', res)
          ModalDialogs.success('Username updated');
          this.state.user.username = username;
          this.setState({ user: this.state.user });
        })
        .catch((error) => {
          ModalDialogs.error(error.message);
        });
    }).catch((error) => {
      ModalDialogs.error(error.message);
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
        localStorage.clear();
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
              res.data.items = [];
              this.props.addnew(res.data);
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
      loggedIn: this.props.loggedIn,
      user: this.props.user,
    };
    this.addNewbucketlist = this.addNewbucketlist.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      user: nextProps.user,
      loggedIn: nextProps.loggedIn
    });
  }
  addNewbucketlist(res) {
    this.props.addNew(res);
  }
  render() {
    return (
      <div className="row topBannner">
        <div className="col-3 banner-sect">
          <User logStatus={this.state.loggedIn} user={this.state.user} logout={this.props.updateLoggedInState}/>
        </div>
        <div className="col-6 banner-sect">
          <Titlebox />
        </div>
        <div className="col-3 banner-sect">
          <ActionButton logStatus={this.props.loggedIn} addnew={this.addNewbucketlist} />
        </div>
      </div>
    );
  }
}
export default Header;
