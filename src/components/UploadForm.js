import React from "react";
import { auth, imageDb, db } from "../firebase-config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 } from "uuid";

export default function UploadForm() {
    const [isImgBtnClicked, setIsImgBtnClicked] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState('');
    const [previewImageSrc, setPreviewImageSrc] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');


    React.useEffect(() => {
        if (!selectedFile || !isImgBtnClicked) {
            setPreviewImageSrc(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreviewImageSrc(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // only allow one image to be uploaded
        setSelectedFile(e.target.files[0])
    }

    const onTitleUpdate = e => {
        setTitle(e.target.value);
    }

    function resetTitle() {
        setTitle("");
    }

    const onBodyUpdate = e => {
        setBody(e.target.value);
    }

    function resetBody() {
        setBody("");
    }

    // function to upload image to storage with unique uploadRef, then get download URL and return 
    async function uploadImageToStorage(uploadRef) {
        // if no image uploaded, set src to 'no image'
        if (!selectedFile) {
            return "no image";
        }

        const imgRef = ref(imageDb, `files/${uploadRef}`);
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

    // add post to database with all info
    async function addPostToDB() {
        try {
            // Generate unique upload reference
            const uploadRef = v4();

            // Upload image to storage and get download URL
            const src = await uploadImageToStorage(uploadRef);

            // Add post data to Firestore database
            const docRef = await addDoc(collection(db, "posts"), {
                title: title,
                body: body,
                imageSrc: src,
                userId: auth.currentUser.uid,
                displayName: auth.currentUser.displayName,
                createdAt: serverTimestamp(),
                uploadRef: uploadRef
            });
            console.log("Document written with ref: ", uploadRef);
            resetTitle();
            resetBody();
            setSelectedFile(undefined);
        } catch (error) {
            console.error("Error adding post to Firestore:", error.message);
        }
    }

    return (
       <div className="upload-form-container">
            <label htmlFor="new-post-title" className="login-form-text">Title</label>
            <input id="new-post-title" onChange={onTitleUpdate}></input>
            <label htmlFor="uploaded-image" className="login-form-text">Upload an image</label>
            <FontAwesomeIcon icon={isImgBtnClicked ? faCircleMinus : faImage} className="add-new-img-icon" onClick={() => setIsImgBtnClicked(prevState => !prevState)}/>
            {isImgBtnClicked ? (
            <div className="image-upload">
                <div className="post-image-preview-container">
                    <img id="new-post-image-preview" className="post-image-preview" alt="" src={previewImageSrc}></img>
                </div>    
                <input 
                        type="file" id="uploaded-post-image" 
                        className="post-img" 
                        name="post-img"
                        onChange={onSelectFile}
                />
            </div>) : (null)}
            <label htmlFor="new-post-body" className="login-form-text">Tell us more!</label>
            <textarea id="new-post-body" className="body-input" onChange={onBodyUpdate}></textarea>
            <div className="form-controls">
                <button id="upload-post-btn" className="primary-button" onClick={addPostToDB}>Upload post</button>
            </div>
        </div>
    )

}

