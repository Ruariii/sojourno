import React from "react";
import Post from "./Post";
import { db, auth } from "../firebase-config";
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthEurope, faUser } from '@fortawesome/free-solid-svg-icons';

export default function PostList() {

    const [posts, setPosts] = React.useState([]);
    const [showAllPosts, setShowAllPosts] = React.useState(false);
    const [showUserPosts, setShowUserPosts] = React.useState(true);

    const collectionName = "posts";
    const postsRef = collection(db, collectionName);

    // get post data from firestore and assign to state
    React.useEffect(() => {
        let q = "";
        if (showAllPosts) {
            q = query(
                postsRef,
                orderBy("createdAt", "desc")    
            );
        } else {
            q = query(
                postsRef,
                where("userId", "==", auth.currentUser.uid),
                orderBy("createdAt", "desc")    
            );
        }
        const unsubscribe = onSnapshot(q, function (querySnapshot) {
            setPosts([]);
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                setPosts(prev => [...prev, {
                    title: doc.data().title,
                    body: doc.data().body,
                    imageSrc: doc.data().imageSrc,
                    userId: doc.data().userId,
                    displayName: doc.data().displayName,
                    createdAt: doc.data().createdAt,
                    uploadRef: doc.data().uploadRef,
                    id: doc.id
                }]); 
            }) 
        });
        //console.log(posts);
        return unsubscribe;
    }, [showAllPosts]);

    function toggleShowUserPosts() {
        setShowAllPosts(false);
        setShowUserPosts(true);
    }

    function toggleShowAllPosts() {
        setShowUserPosts(false);
        setShowAllPosts(true);
    }

    const showAllPostsButtonStyles = {
        color: showAllPosts ? 'aliceblue' : 'slateblue',
        fontSize: '3rem'
    }

    const showUserPostsButtonStyles = {
        color: showUserPosts ? 'aliceblue' : 'slateblue',
        fontSize: '3rem'
    }


    // pass state to Post component as props
    //ADD DISPLAYNAME TO POST UPLOAD or GET DISPLAYNAME FROM UID
    const postElements = posts.map(post => <Post key={post.id} id={post.id} userId={post.userId} displayName={post.displayName} title={post.title} body={post.body} imageSrc={post.imageSrc} uploadRef={post.uploadRef}/>);
    
    return (
        <div className="post-list">
            <div className="post-list-header">
                <FontAwesomeIcon 
                    icon={faUser} 
                    className="post-list-header-icon" 
                    onClick={toggleShowUserPosts} 
                    style={showUserPostsButtonStyles}
                >
                </FontAwesomeIcon>
                <FontAwesomeIcon 
                    icon={faEarthEurope} 
                    className="post-list-header-icon" 
                    onClick={toggleShowAllPosts} 
                    style={showAllPostsButtonStyles}
                >
                </FontAwesomeIcon>
            </div>
            {postElements}
        </div>
    )
}