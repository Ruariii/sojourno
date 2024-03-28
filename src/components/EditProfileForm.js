import React from "react";
import { auth, imageDb } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { updateProfile } from 'firebase/auth';

export default function EditProfileForm() {    

    const [isImgBtnClicked, setIsImgBtnClicked] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState('');
    const [profileImageSrc, setProfileImageSrc] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');

    React.useEffect(() => {
        if (!selectedFile) {
            setProfileImageSrc(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setProfileImageSrc(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectProfileImage = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // only allow one image to be uploaded
        setSelectedFile(e.target.files[0])
    }

    const onDisplayNameUpdate = e => {
        setDisplayName(e.target.value);
    }

    // function to upload profile image to storage with user id ref, then get download URL and return 
    async function uploadProfileImageToStorage(uid) {
        // if no image uploaded, set src to 'no image'
        if (!selectedFile) {
            return("no image");
        }

        const imgRef = ref(imageDb, `profiles/${uid}`);
        try {
            // Upload image to storage
            await uploadBytes(imgRef, selectedFile);
            // Get download URL for the uploaded image
            const url = await getDownloadURL(imgRef);
            return url;
        } catch (error) {
            console.error("Error uploading image to storage:", error.message);
            throw error;
        }

    }

    async function updateProfileDetails() {
        try {
            let profileUpdates = {};
    
            if (displayName) {
                profileUpdates.displayName = displayName;
            }
    
            if (profileImageSrc) {
                const src = await uploadProfileImageToStorage(auth.currentUser.uid);
                profileUpdates.photoURL = src;
            }
    
            if (Object.keys(profileUpdates).length > 0) {
                await updateProfile(auth.currentUser, profileUpdates);
                console.log("Profile details updated successfully");
            } else {
                console.log("No profile details to update");
            }
        } catch (error) {
            console.error("Error updating profile details:", error.message);
        }
    }
    
    


    return (
        <div className="upload-form-container">
            <label htmlFor="update-display-name" className="login-form-text">Edit Display Name:</label>
            <input id="update-display-name" onChange={onDisplayNameUpdate}></input>
            <label htmlFor="update-image" className="login-form-text">Edit Profile Picture</label>
            <FontAwesomeIcon icon={isImgBtnClicked ? faCircleMinus : faImage} className="add-new-img-icon" onClick={() => setIsImgBtnClicked(prevState => !prevState)}/>
            {isImgBtnClicked ? (
            <div className="image-upload">
                <div className="profile-image-preview-container">
                    <img id="profile-image" className="profile-image" alt="profile preview" src={profileImageSrc ? (profileImageSrc) : ("./user-solid.svg")}></img>
                </div>    
                <input 
                        type="file" id="uploaded-profile-image" 
                        className="profile-img" 
                        name="profile-img"
                        onChange={onSelectProfileImage}
                />
            </div>) : (null)}
            <div className="form-controls">
                <button id="upload-post-btn" className="primary-button" onClick={updateProfileDetails}>Update Profile</button>
            </div>
        </div>
    )
}