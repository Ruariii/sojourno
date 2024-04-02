import React from "react";
import Navbar from "./components/Navbar";
import PostList from "./components/PostList";
import Sidebar from "./components/Sidebar"

export default function Main() {


    return (
        <div className="main-background">
            <Navbar />
            <Sidebar />
            <PostList />
        </div>
    )
}