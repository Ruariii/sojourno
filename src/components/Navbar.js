import React from "react";
import { signOut } from "firebase/auth";
import { auth } from '../firebase-config';

export default function Navbar() {

    function signOutButtonPressed() {
        signOut(auth).then(() => {
        }).catch((error) => {
          console.error(error.message);
        });
    }


    return (
        <div className="nav">
            <h1 className='nav-title'>Sojourno</h1>
            <div  className="nav-link-container">
                <div className="nav-link" onClick={signOutButtonPressed}> Sign out </div>
            </div>
        </div>
    )
}