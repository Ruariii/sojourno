import React from "react";
import { auth } from "../firebase-config";
import UploadForm from './UploadForm';
import EditProfileForm from './EditProfileForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {

    const [uploadForm, setUploadForm] = React.useState(false);
    const [editProfileForm, setEditProfileForm] = React.useState(false);

    function showUploadForm() {
        setEditProfileForm(false);
        setUploadForm((prev) => (!prev));
    }

    function showEditProfileForm() {
        setUploadForm(false);
        setEditProfileForm((prev) => (!prev));
    }

// add delete icon to remove seclected image before uploading (as in post component)

    return (
        <div className="sidebar-container">
            <div className="user-details">
                <div className="profile-image-container">
                        <img id="profile-image" className="profile-image" alt="profile" src={auth.currentUser.photoURL ? (auth.currentUser.photoURL) : ("./user-solid.svg")}></img>
                </div>
                <h1 className="main-title">Hello {auth.currentUser.displayName ? (auth.currentUser.displayName) : (null)}!</h1>
            </div>
            <div className="sidebar-controls">
                <FontAwesomeIcon icon={faCirclePlus}  className="add-new-post-icon" onClick={showUploadForm}/>
                <FontAwesomeIcon icon={faPenToSquare}  className="add-new-post-icon" onClick={showEditProfileForm}/>
            </div>
            {uploadForm ? (<UploadForm />) : (editProfileForm ? (<EditProfileForm/>) : (null))}
            
        </div>
    )
}