import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import '../css/Main.css';
import '../App.css';

const Posts = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [topic, setTopic] = useState<any>(null);

    useEffect(() => {
        if (topicId) {
            fetchTopic(topicId);
            fetchPosts(topicId);
        }
    }, [topicId]);

    const fetchTopic = async (topicId: string) => {
        try {
            const response = await axios.get(`/topic/${topicId}`);
            setTopic(response.data);
        } catch (error) {
            console.error('Error fetching topic', error);
        }
    };

    const fetchPosts = async (topicId: string) => {
        try {
            const response = await axios.get(`/topic/${topicId}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await axios.delete(`/post/${postId}`);
            if (topicId)
                fetchPosts(topicId);
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    return (
        <div className='main-container'>
            <div className='topic-banner'>
                {topic && <h2 className='banner-item'>{topic.name}</h2>}
                <button className='banner-item' onClick={() => navigate(`/topic/${topicId}/create-post`)}><FontAwesomeIcon icon={faPlus}/> Create a Post</button>
            </div>
            <div className='posts-container'>
                <div>
                    {posts.length > 0 ? (
                        posts.map((post: any) => (
                            <>
                                <li onClick={() => navigate(`/post/${post.id}`)} key={post.id} className='post-body'>
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <p>Posted by {post.author.userName} on {new Date(post.createdAt).toLocaleString()}</p>
                                    <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                                </li>
                                <p className='line'></p>
                            </>
                        ))
                    ) : (
                        <p>No posts in current topic</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Posts;
