import React from 'react';
import LoginImage from './components/LoginImage'
import LoginForm from './components/LoginForm'

export default function Login() {
    return (
        <div className='login-background'>
            <div className='login-split-left'>
                <LoginImage />
            </div>
            <div className='login-split-right'>
                <LoginForm />
            </div>
        </div>
    )
}