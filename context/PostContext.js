import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { API_URL } from "../src/config";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchPosts()
    },[])

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/posts`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch posts")
                setPosts(data)
        } catch (error) {
            toast.show(error.message, { type: "danger" });
        } finally {
            setLoading(false);
        }
    }

    // create a new post 
    const createPost = async (postData) => {
        try {
            const token = await AsyncStorage.getItem("token")
            if (!token) throw new Error("Unauthorized. Please log in.")

                const response = await fetch(`${API_URL}/posts`, {
                    method: "POST",
                    headers: {
                       "Authorization": `Bearer ${token}`,
                       "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postData)
                })


                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Failed to create post.");
                setPosts([data.post, ...posts]);
                toast.show("Post created successfully!", { type: "success" });
    

        } catch (error) {
            toast.show(error.message, { type: "danger" });
        }
    }

    //  update a post
    const updatePost = async (id, updatedData) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Unauthorized. Please log in.");

            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update post.");

            setPosts(posts.map((post) => (post._id === id ? data.post : post)));
            toast.show("Post updated successfully!", { type: "success" });
        } catch (error) {
            toast.show(error.message, { type: "danger" });
        }
    };

    // Delete a post
    const deletePost = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Unauthorized. Please log in.");

            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to delete post.");

            setPosts(posts.filter((post) => post._id !== id));
            toast.show("Post deleted successfully!", { type: "success" });
        } catch (error) {
            toast.show(error.message, { type: "danger" });
        }
    };


 // Like a post
 const likePost = async (postId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please log in.");

        // Optimistic UI update
        setPosts(posts.map((post) =>
            post._id === postId
                ? { ...post, likeCount: post.likeCount + 1, isLikedByUser: true }
                : post
        ));

        const response = await fetch(`${API_URL}/posts/like/${postId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to like post.");

        setPosts(posts.map((post) =>
            post._id === postId
                ? { ...post, likeCount: data.likeCount }
                : post
        ));

        toast.show("Post liked!", { type: "success" });
    } catch (error) {
        toast.show(error.message, { type: "danger" });
        fetchPosts(); // Revert to correct data in case of failure
    }
};



// Dislike a post
const dislikePost = async (postId) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please log in.");

        // Optimistic UI update
        setPosts(posts.map((post) =>
            post._id === postId
                ? { ...post, likeCount: Math.max(post.likeCount - 1, 0), isLikedByUser: false }
                : post
        ));

        const response = await fetch(`${API_URL}/posts/dislike/${postId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to dislike post.");

        setPosts(posts.map((post) =>
            post._id === postId
                ? { ...post, likeCount: data.likeCount }
                : post
        ));

        toast.show("Post unliked!", { type: "success" });
    } catch (error) {
        toast.show(error.message, { type: "danger" });
        fetchPosts(); // Revert to correct data in case of failure
    }
};



    return (
        <PostContext.Provider
           value={{
              posts,
              loading,
              fetchPosts,
              createPost,
              updatePost,
              deletePost,
              likePost,
              dislikePost
           }}
        >
            {children}
        </PostContext.Provider>
    )
}