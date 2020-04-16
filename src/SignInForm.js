import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

import SignOutForm from './SignOutForm';

const initialState = {
    username: '',
    password: '',
    signedIn: false,
    userData: '',
    signInAttempt: false,
    confirmationCode: '',
    verified: false
};

class SignInForm extends Component {
    constructor(props) {
        super(props);
  
        this.state = initialState;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.signIn = this.signIn.bind(this);
        this.confirmSignIn = this.confirmSignIn.bind(this);
        this.confirmSignUp = this.confirmSignUp.bind(this);
    }
  
    signIn() {
        const { username, password } = this.state;  
        // This is the auth call for sign in, relatively straight forward
        // Link : https://aws-amplify.github.io/docs/js/authentication
        Auth.signIn({
            username: username,
            password: password
        })
        .then(() => {
            console.log('successfully signed in');
            this.setState({
                signedIn: true,
                verified: true
            });
        })
        .catch (err => {
            if (err.code === 'UserNotConfirmedException') {
                // The error happens if the user didn't finish the confirmation step when signing up
                // In this case you need to resend the code and confirm the user
                // About how to resend the code and confirm the user, please check the signUp part
                this.setState({
                    signedIn: true,
                    verified: false
                })
                console.log("USER NOT CONFIRMED");
                Auth.resendSignUp(username).then(() => {
                    console.log('code resent successfully');
                }).catch(e => {
                    console.log(e);
                });
            } else if (err.code === 'PasswordResetRequiredException') {
                // The error happens when the password is reset in the Cognito console
                // In this case you need to call forgotPassword to reset the password
                // Please check the Forgot Password part.
                console.log("PASSWORD RESET REQUIRED")
            } else if (err.code === 'NotAuthorizedException') {
                // The error happens when the incorrect password is provided
                console.log("NOT AUTHORIZED")
            } else if (err.code === 'UserNotFoundException') {
                // The error happens when the supplied username/email does not exist in the Cognito user pool
                console.log('USER NOT FOUND');
            } else {
                console.log(err);
            }
        })
        .finally(() => {
            this.setState({
                signInAttempt: true
            });
        });       
    }
  
    confirmSignIn() {
        const { username } = this.state;
        Auth.confirmSignIn(username)
        .then(() => console.log('successfully confirmed signed in'))
        .catch((err) => console.log(`Error confirming sign up - ${ err }`))
    }

    confirmSignUp() {
        const { username, confirmationCode } = this.state;
        Auth.confirmSignUp(username, confirmationCode)
        .then(() => {
            console.log('Successfully confirmed signed up');
            this.setState({
                verified: true
            });
        })
        .catch((err) => console.log(`Error confirming sign up - ${ err }`))
    }
  
  
    handleSubmit(e) {
        if (e.target.id === 'signInForm') {
            e.preventDefault();
            this.signIn();
            this.confirmSignIn();
            e.target.reset(); 
        } else {
            this.confirmSignUp();
            this.confirmSignIn();
        }
        
    }
  
    handleChange(e) {
        if (e.target.id === 'username') {
          this.setState({
              username: e.target.value
          });
        } else if (e.target.id === 'password') {
          this.setState({
              password: e.target.value
          });
        } else if (e.target.id === 'confirmationCode') {
            this.setState({
                confirmationCode: e.target.value
            });
        }
    }

    handleSignout = (signOutStatus) => {
        Auth.signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
        this.setState(initialState);
    }
  
    render() {
      const { signedIn, signInAttempt, verified } = this.state;

      // there are four cases that can be handled
      // 1. signed in and not verified
      //        in which case they must be verified
      // 2. signed in and verified
      //        in which case everything is good and can be forwarded to the app
      // 3. not signed in and haven't attempted
      //        give sign up for user
      // 4. not signed in and have attempted
      //        give sign up with warning/error message
      if (signedIn) {
          if (!verified) {
            return(
                <div>
                  <form onSubmit={ this.handleSubmit }>
                      <label>Confirmation Code</label>
                      <input id='confirmationCode' type='text' onChange={ this.handleChange }/>
                      <button>Confirm Sign up</button>
                  </form>
              </div>
            )
          }
          return (
              <div>
                  <SignOutForm onSignOut={this.handleSignout}/>
              </div>
          );
      } else {
        if(!signInAttempt) {
            return (
                <div>
                    <form id='signInForm' onSubmit={ this.handleSubmit }>
                        <label>Username</label>
                        <input id='username' type='text' onChange={ this.handleChange }/>
                        <label>Password</label>
                        <input id='password' type='password' onChange={ this.handleChange }/>
                        <button>Sign In</button>
                    </form>
                </div>
            );
        } else {
            return(
                <div>
                    <p>FAILED ATTEMPT</p>
                    <form onSubmit={ this.handleSubmit }>
                        <label>Username</label>
                        <input id='username' type='text' onChange={ this.handleChange }/>
                        <label>Password</label>
                        <input id='password' type='password' onChange={ this.handleChange }/>
                        <button>Sign In</button>
                    </form>
                </div>
            );
        }
      }
    }
}

export default SignInForm;