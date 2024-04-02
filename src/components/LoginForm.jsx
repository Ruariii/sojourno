import React, { useState } from 'react';
import {    createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            signInWithPopup,
            updateProfile  } from 'firebase/auth';
import { auth, provider } from '../firebase-config';

export default function LoginForm() {

    const [isRegisterVisible, setRegisterVisible] = useState(true);

    function showSignInView(event) {
        event.preventDefault();
        setEmail("");
        setPassword("");
        setRegisterVisible(false);
    };

    function showRegisterView(event) {
        event.preventDefault();
        setEmail("");
        setPassword("");
        setRegisterVisible(true);
    };

    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UPDATE TO SET USER DISPLAY NAME ON ACC
    const onRegisterSubmit = async (name, email, password) => {
        try {
          await createUserWithEmailAndPassword(auth, email, password).catch((err) =>
            console.log(err)
          );
          await updateProfile(auth.currentUser, { displayName: name }).catch(
            (err) => console.log(err)
          );
        } catch (err) {
          console.log(err);
        }
        console.log(auth.currentUser)
      };

    const onLoginSubmit = async(e) => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setEmail("");
                setPassword("");
                setName("");
            })
            .catch((error) => {
                console.error(error.message);
            })
    }

    const onGoogleLoginSubmit = async(e) => {
        e.preventDefault();
        await signInWithPopup(auth, provider)
            .then((result) => {
                setEmail("");
                setPassword("");
            })
            .catch((error) => {
                console.error(error.message);
            })
    }

    


    return (
            <div className='container'>
            {isRegisterVisible ? (
                <div className='login-form-container'>
                    <div className='login-navbar'>
                        <p className='login-form-text'>Already have an account?</p>
                        <button className='nav-button' id='nav-sign-in' onClick={showSignInView}>Sign in</button>
                    </div>
                    <h1 className='login-subtitle'>Welcome to Sojourno!</h1>
                    <p className='login-form-text' style={{color:'lightslategrey'}}>Register your account</p>
                    <div className='login-form'>
                        <label htmlFor='register-name' className='login-form-text'>Name</label>
                        <input id='register-name'></input>
                        <label htmlFor='register-email'  className='login-form-text'>Email</label>
                        <input id='register-email' type='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <label htmlFor='register-pwd'  className='login-form-text'>Password</label>
                        <input id='register-pwd' type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <div className='login-buttons'>
                            <button 
                                className="primary-button"
                                onClick={() => onRegisterSubmit(name, email, password)}
                            >
                                Login
                            </button>
                            <button className='secondary-button'  onClick={onGoogleLoginSubmit}>
                                    Sign in with
                                    <img src='./google-icon.webp' className='google-icon' alt='google icon'/>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='login-form-container'>
                    <div className='login-navbar'>
                        <p className='login-form-text'>Don't have an account?</p>
                        <button className='nav-button' id='nav-register' onClick={showRegisterView}>Register</button>
                    </div>
                    <h1 className='login-subtitle'>Welcome to Sojourno!</h1>
                    <p className='login-form-text' style={{color:'lightslategrey'}}>Sign in to your account</p>
                    <div className='login-form'>
                        <label htmlFor='sign-in-email'  className='login-form-text'>Email</label>
                        <input id='sign-in-email' type='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <label htmlFor='sign-in-pwd'  className='login-form-text'>Password</label>
                        <input id='sign-in-pwd' type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <div className='login-buttons'>
                            <button 
                                className="primary-button"
                                onClick={onLoginSubmit}
                            >
                                Login
                            </button>
                            <button className='secondary-button' onClick={onGoogleLoginSubmit}>
                                    Sign in with
                                    <img src='./google-icon.webp' className='google-icon' alt='google icon'/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>       
    )
}