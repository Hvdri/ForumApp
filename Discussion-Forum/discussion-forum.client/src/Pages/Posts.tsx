import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';

import '../css/Main.css';
import '../App.css'

const TopicPage = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    useEffect(() => {
        if (topicId) {
            fetchPosts(topicId);
        }
    }, [topicId]);

    const fetchPosts = async (topicId: string) => {
        try {
            const response = await axios.get(`/topic/${topicId}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/post', { ...newPost, topicId });
            setNewPost({ title: '', content: '' });
            if (topicId) 
                fetchPosts(topicId);
        } catch (error) {
            console.error('Error creating post', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await axios.delete(`/post/${postId}`);
            if(topicId)
                fetchPosts(topicId);
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    return (
        <>
            <h2>Posts</h2>
            <form onSubmit={handleCreatePost}>
                <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title"
                    required
                />
                <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Post content"
                    required
                ></textarea>
                <button type="submit">Create Post</button>
            </form>
            <ul>
                {posts.length > 0 ? (
                    posts.map((post: any) => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <p>Posted by {post.author.userName} on {new Date(post.createdAt).toLocaleString()}</p>
                            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No posts in current topic</p>
                )}
            </ul>
        </>
    );
};

export default TopicPage;
