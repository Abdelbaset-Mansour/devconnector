import React, { Component } from 'react';
import classNames from 'classnames';
import axios from 'axios';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
  };
  inputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    axios
      .post('/api/users/register', newUser)
      .then(response => {
        console.log(response.data);
      })
      .catch(err => this.setState({ errors: err.response.data }));
  };
  render() {
    const { errors } = this.state;
    return (
      <form noValidate className="register" onSubmit={this.onSubmit}>
        <div className="field">
          <label className="label">Name</label>
          <div className="control has-icons-left">
            <input
              className={classNames('input', { 'is-danger': errors.name })}
              name="name"
              type="text"
              placeholder="Text input"
              value={this.state.name}
              onChange={this.inputChange}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user"></i>
            </span>
          </div>
          {/* If errors */}
          {errors.name ? <p className="help is-danger">{errors.name}</p> : null}
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control has-icons-left">
            <input
              className={classNames('input', { 'is-danger': errors.email })}
              type="email"
              name="email"
              placeholder="Email input"
              value={this.state.email}
              onChange={this.inputChange}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
          </div>
          {/* If errors */}
          {errors.email ? (
            <p className="help is-danger">{errors.email}</p>
          ) : null}
        </div>
        {/* Password */}
        <div className="field">
          <label className="label">Password</label>
          <div className="control has-icons-left">
            <input
              className={classNames('input', { 'is-danger': errors.password })}
              type="password"
              name="password"
              placeholder="Type password"
              value={this.state.password}
              onChange={this.inputChange}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </div>
          {/* If errors */}
          {errors.password ? (
            <p className="help is-danger">{errors.password}</p>
          ) : null}
        </div>
        {/* Confirm Password */}
        <div className="field">
          <label className="label">Confirm</label>
          <div className="control has-icons-left">
            <input
              className={classNames('input', { 'is-danger': errors.password2 })}
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={this.state.password2}
              onChange={this.inputChange}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-lock"></i>
            </span>
          </div>
          {/* If errors */}
          {errors.password2 ? (
            <p className="help is-danger">{errors.password2}</p>
          ) : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-link full-width">
              Sign Up
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default Register;
