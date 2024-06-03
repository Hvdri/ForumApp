import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import '../css/Main.css';
import '../App.css';

const Posts = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [topic, setTopic] = useState<any>(null);

    useEffect(() => {
        if (location.state && location.state.topic) {
            setTopic(location.state.topic);
        } else if (topicId) {
            fetchTopic(topicId);
        }
        fetchPosts(topicId);
    }, [topicId]);

    const fetchTopic = async (topicId: string) => {
        try {
            const response = await axios.get(`/topic/${topicId}`);
            setTopic(response.data);
        } catch (error) {
            console.error('Error fetching topic', error);
        }
    };

    const fetchPosts = async (topicId: string | undefined) => {
        if (!topicId) return;
        try {
            const response = await axios.get(`/topic/${topicId}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    const handlePostClick = (post: any) => {
        navigate(`/post/${post.id}`, { state: { post, topic } });
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await axios.delete(`/post/${postId}`);
            fetchPosts(topicId);
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    return (
        <div className='main-container'>
            <div className='topic-banner'>
                {topic && <h2 className='banner-item'>{topic.name}</h2>}
                <div className='banner-item'>
                    <button className='banner-group-item' onClick={() => navigate(`/topic/${topicId}/create-post`)}><FontAwesomeIcon className='banner-icon' icon={faPlus} />Create a post</button>
                </div>
            </div>
            {posts.length > 0 ? (
                posts.map((post: any) => (
                    <div className='post-container'>
                        <li onClick={() => handlePostClick(post)} key={post.id} className='post-body'>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <p>Posted by {post.author.userName} on {new Date(post.createdAt).toLocaleString()}</p>
                            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </li>
                        <p className='line'></p>
                    </div>
                ))
            ) : (
                <p>No posts in current topic</p>
            )}
        </div>
    );
};

export default Posts;
