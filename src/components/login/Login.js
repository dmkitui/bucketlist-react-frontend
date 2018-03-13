import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import './login.css';
import { User } from '../../helpers/models';
import Animation from '../../helpers/animation';
import AuthAPI from '../../api/Auth';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      canSubmit: this.submitStatus,
      validEmail: false,
      invalidPassword: false,
      LoginErrorMessage: '',
      loading: false,
    };
  }
  submitStatus() {
    const { email, password } = this.state;
    return (!this.state.invalidEmail && password.length > 0);
  }
  userInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  passwordBlur(e) {
    if (e.target.value === '') {
      this.setState({ invalidPassword: true });
    }
  }
  validateEmail() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.state.email)) {
      this.setState({ invalidEmail: false });
      console.log(`Valid Email ${this.state.email}`);
    } else {
      this.setState({ invalidEmail: true });
      console.log(`invalid Email ${this.state.email}`);
    }
  }
  loginUser(event) {
    this.setState({
      loading: true,
    });
    AuthAPI.login(this.state.email, this.state.password)
      .then((res) => {
        console.log('LOGIN RESPONSE TOKEN: ', res.data);
        const token = res.data.access_token;
        const userInfo = jwtDecode(token);
        console.log('DECODED INFO: ', userInfo);

        const user = new User(userInfo.sub, userInfo.username, this.state.email, userInfo.avatar); // id, username, email, avatarUrl
        this.setState({
          loading: false,
        });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(user));

        this.props.loginState(user);
      })
      .catch((error) => {
        if (error.message === 'Network Error') {
          this.setState({
            LoginErrorMessage: error.message,
            loading: false,
          });
        } else {
          this.setState({
            LoginErrorMessage: error.response.data.message,
            loading: false,
          });
        }
      });
    event.preventDefault();
  }
  render() {
    const isValid = !this.submitStatus();
    return (
      <div className="login-box">
        <form onSubmit={event => this.loginUser(event)}>
          <div className={this.state.loading ? 'login-form loading' : 'login-form'}>
            <div className="anim text-center" hidden={!this.state.loading}>
              <Animation type="spinningBubbles" color="green" />
              Login you in...
            </div>
            <div hidden={this.state.loading}>
              <label className="label-text">Email Address:</label>
              <input
                name="email"
                onChange={event => this.userInput(event)}
                onBlur={event => this.validateEmail()}
                value={this.state.email}
                type="email"
                placeholder="Email"
                className={`login-input${this.state.invalidEmail ? ' has-error' : ''}`}
              />
              {this.state.invalidEmail ? <div className="error-message text-center">Invalid Email</div> : ''}
              <br />
              <label className="label-text">Password:</label>
              <input
                name="password"
                required="required"
                onChange={event => this.userInput(event)}
                value={this.state.password}
                placeholder="password"
                type="password"
                onBlur={event => this.passwordBlur(event)}
                className={`login-input${this.state.invalidPassword ? ' has-error' : ''}`}
              />
              {this.state.invalidPassword ? <div className="error-message text-center">Password cannot be blank</div> : ''}
              <br />
              <div className="submit-btn-container">
                <button type="submit" className="submit-btn" disabled={isValid}>Submit</button>
              </div>
              {this.state.LoginErrorMessage ? <div className="error-message text-center">{this.state.LoginErrorMessage}</div> : ''}
              <div className="row">
                <div className="col-md-12">
                  <div className="text-left col-md-5 float-left">
                    <button className="btn-link register-link">Register</button>
                  </div>
                  <div className="text-right col-md-5 float-lg-right">
                    <button className="btn-link register-link">Forgot Password?</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default Login;
