import React, { Component } from 'react';
import decode from 'jwt-decode';
import Login from '../login/Login';
import Header from '../header/Header';
import Helpers from '../../helpers/Utilities';
import BucketlistView from '../bucketlistview/BucketlistView';
import './home.css';


class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.isLoggedIn(),
      user: JSON.parse(localStorage.getItem('user')),
      newBucketlist: null,
    };
    this.updateLoginStatus = this.updateLoginStatus.bind(this);
    this.newBucketlist = this.newBucketlist.bind(this);
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    return (token && Helpers.isTokenValid());
  }

  updateLoginStatus(user) {
    if (user) {
      this.setState({
        loggedIn: true,
        user,
      });
    } else {
      this.setState({
        loggedIn: false,
      });
    }
  }
  newBucketlist(res) {
    console.log('New item added? ', res);
    this.setState({
      newBucketlist: res,
    });
  }
  render() {
    return (
      <div className="page">
        <div className="header">
          <Header user={this.state.user} loggedIn={this.state.loggedIn} updateLoggedInState={this.updateLoginStatus} addNew={this.newBucketlist}/>
        </div>
        <hr />
        <div className="main-view">
          <div hidden={this.state.loggedIn}>
            <Login loginState={this.updateLoginStatus} />
          </div>
          <div hidden={!this.state.loggedIn}>
            <BucketlistView loggedIn={this.state.loggedIn} newItem={this.state.newBucketlist} />
          </div>
        </div>
        <hr />
        <div className="footer">Footer</div>
      </div>
    );
  }
}
export default MainView;
