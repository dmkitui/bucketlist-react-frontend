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
      scrollable: false,
    };
    this.updateLoginStatus = this.updateLoginStatus.bind(this);
    this.newBucketlist = this.newBucketlist.bind(this);
    this.scrollManager = this.scrollManager.bind(this);
  }
  componentDidMount() {
    const target = document.getElementsByClassName('main-view')[0];
    target.addEventListener('scroll', this.scrollManager);
  }
  componentWillUnmount() {
    const target = document.getElementsByClassName('main-view')[0];
    target.removeEventListener('scroll', this.scrollManager);
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
  scrollManager() {
    const target = document.getElementsByClassName('main-view')[0];
    console.log('Scrolling?: ', target.clientHeight, 'ScrollHeight: ', target.scrollHeight, ' From Top: ', target.scrollTop);
    if (target.scrollHeight > target.clientHeight) {
      console.log('Time to scroll?');
      this.setState({
        scrollable: true,
      });
    } else {
      this.setState({
        scrollable: false,
      });
    }

    if ((target.scrollTop + target.clientHeight) > target.scrollHeight) {
      console.log('Reached top?');
      document.getElementsByClassName('scroll-indicator-bottom')[0].classList.add('reached-bottom');
    } else {
      document.getElementsByClassName('scroll-indicator-bottom')[0].classList.remove('reached-bottom');
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
          <Header user={this.state.user} loggedIn={this.state.loggedIn} updateLoggedInState={this.updateLoginStatus} addNew={this.newBucketlist} />
        </div>
        <hr />
        <span className="scroll-indicator-top" hidden={!this.state.scrollable} />
        <div className="main-view">
          <div hidden={this.state.loggedIn}>
            <Login loginState={this.updateLoginStatus} />
          </div>
          <div hidden={!this.state.loggedIn}>
            <BucketlistView loggedIn={this.state.loggedIn} newItem={this.state.newBucketlist} />
          </div>
        </div>
        <span className="scroll-indicator-bottom" hidden={!this.state.scrollable} />
        <hr />
        <div className="footer">Footer</div>
      </div>
    );
  }
}
export default MainView;
