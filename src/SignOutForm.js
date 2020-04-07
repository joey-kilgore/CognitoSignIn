import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

class SignOutForm extends Component {
    constructor(props) {
        super(props);
  
        this.state = {
            signedIn: true,
            user: ''
        };

        this.handleSignOut = this.handleSignOut.bind(this);
        this.signOut = this.signOut.bind(this);

        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then(user => {
            console.log(user);
            this.setState({
                user: user
            });
        })
        .catch(err => console.log(err));

        var sessionData;
        Auth.currentSession()
        .then(data => { console.log(data); sessionData = data;})
        .catch(err => console.log(err));

        /*
        var jwt = require('jsonwebtoken');
        var decoded = jwt.decode(sessionData.idToken);
        console.log(decoded);*/

        /*
        var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
        var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
        var CognitoUser = AmazonCognitoIdentity.CognitoUser;

        var userPool = new CognitoUserPool({UserPoolId: this.state.user['pool']['userPoolId'], ClientId: this.state.user['pool']['clientID']});

        var cognitoUser = userPool.getCurrentUser();
        if(cognitoUser != null){
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    console.error(err);
                }
                console.log('session validity: ' + session.isValid());

                var sessionIdInfo = jwt.Decode(session.getIdToken().jwtToken);
                console.log(sessionIdInfo['cognito:groups']);
            });
        }
        */
    }
  
    signOut() {
        Auth.signOut()
        .then(data => {console.log(data); this.setState({signedIn: false});})
        .catch(err => console.log(err));
        this.props.onSignOut(true)
    }

  
    handleSignOut(e) {
        e.preventDefault();
        this.signOut();
    
        const { signedIn } = this.state;

        if(!signedIn){ 
            e.target.reset();  
        } 
    }
  
    render() {
        const { signedIn } = this.state;

        if(signedIn){
            return (
                <div>
                    <button onClick={this.handleSignOut}>SIGN OUT</button>
                    <p>{this.state.user.username}</p>
                </div>
            )
        } else {
            return (
                <h1>SIGNED OUT</h1>
            )
        }
    }
}

export default SignOutForm;