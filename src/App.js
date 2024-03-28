import React, {useState, useEffect} from 'react';
import Login from './Login.js';
import Main from './Main.js';
import {onAuthStateChanged} from "firebase/auth";
import {auth, provider, db} from './firebase-config';

export default function App() {
    const collectionName = "posts";

    // create state isLoggedIn (boolean)
    // onAuthStateChanged setIsLoggedIn true / false
    // set display property of Main & login to isLoggedIn & !isLoggedIn

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              setIsLoggedIn(true);
              console.log(user);
            } else {
              // User is signed out
              setIsLoggedIn(false);
              console.log("user is logged out")
        
            }
          });
         
    }, [])

    return (
            <div>
                <section>
                    {isLoggedIn ? <Main/> : <Login/>}                  
                </section>
            </div>
    )
}