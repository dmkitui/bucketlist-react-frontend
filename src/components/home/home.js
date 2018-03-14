import React, { Component } from 'react';
import decode from 'jwt-decode';
import Login from '../login/Login';
import Header from '../header/Header';
import BucketlistView from '../bucketlistview/BucketlistView';
import './home.css';


class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: this.isLoggedIn(),
      user: JSON.parse(localStorage.getItem('user')),
      bucketlists: [],
    };
    this.updateLoginStatus = this.updateLoginStatus.bind(this);
  }

  isTokenValid(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp > (Date.now() / 1000)) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  isLoggedIn() {
    const token = localStorage.getItem('token');
    if (token && this.isTokenValid(token)) {
      return true;
    }
    return false;
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
  render() {
    return (
      <div className="page">
        <div className="header">
          <Header user={this.state.user} loggedIn={this.state.loggedIn} updateLoggedInState={this.updateLoginStatus} />
        </div>
        <hr />
        <div className="main-view">
          <div hidden={this.state.loggedIn}>
            <Login loginState={this.updateLoginStatus} />
          </div>
          <div hidden={!this.state.loggedIn}>
            <BucketlistView />
          </div>
        </div>
        <hr />
        <div className="footer">Footer</div>
      </div>
    );
  }
}
export default MainView;
