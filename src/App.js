import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
Amplify.configure(aws_exports);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedUp : false
        }
        this.handleSignup = this.handleSignup.bind(this);
    }

    handleSignup() {
        this.setState({
            signedUp: true
        });
    }
    render() {
        const { signedUp } = this.state;
        //return !signedUp ? <SignUpForm handleSignup={ this.handleSignup }/> : <SignInForm />;
        return (<SignInForm />);
    }
}

export default App;
