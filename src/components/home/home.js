import React, { Component } from 'react';
import Login from '../login/Login';
import Header from '../header/Header';
import './home.css';


class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null,
    };
    this.updateLoginStatus = this.updateLoginStatus.bind(this);
    //    this.isLoggedIn = this.isLoggedIn.bind(this);
  }
  updateLoginStatus(user) {
    console.log('Logged In?', user);
    if (user) {
      this.setState({
        loggedIn: true,
        user: user,
      });
      console.log('New User: ', user);
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
        </div>
        <hr />
        <div className="footer">Footer</div>
      </div>
    );
  }
}
export default MainView;
