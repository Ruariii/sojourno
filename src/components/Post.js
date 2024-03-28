import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ref, deleteObject } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";
import { imageDb, db, auth } from "../firebase-config";

export default function Post(props) {

    function deleteImageFromStorage(uploadRef) {
        const imgRef = ref(imageDb, `files/${uploadRef}`);
        // Delete the file
        deleteObject(imgRef).then(() => {
            // File deleted successfully
            console.log("Image deleted successfully");
        }).catch((error) => {
            // Uh-oh, an error occurred!
            console.error(error.message);
        });
    }

    
    const deletePostFromDb = async (id) => {
        if (props.imageSrc !== "no image" && props.uploadRef) {
            deleteImageFromStorage(props.uploadRef);
        }
        const reference = doc(db, 'posts', id)
        deleteDoc(reference).then(() => {
            console.log("post deleted")
        }).catch(error => {
            console.error(error.message);
        })
      }

      // add username to posts and remove delete option if post not by user (ternary with props.userId)

    return (
        <div className="post-container">
            <div className="post-nav">
                <div className="post-nav-title-container">
                    <h3 className="post-title">{props.title}</h3>
                    {
                        props.displayName ? 
                        (<h5 className="post-display-name">{props.displayName}</h5>) :
                        (null)
                    }     
                </div>
                { 
                    props.userId === auth.currentUser.uid ? 
                    (<div className="post-nav-icon-container">
                        <FontAwesomeIcon icon={faTrash} className="post-icon" onClick={() => deletePostFromDb(props.id)}/>
                    </div>) : 
                    (null)
                }
            </div>
            {props.imageSrc === "no image" ? (null) : (<div className="post-img-container">
                <img src={props.imageSrc} className="post-img" alt="post"/>
            </div>)}
            <p className="post-body">{props.body}</p>
        </div>)
}