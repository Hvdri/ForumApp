import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../api/axiosConfig';

import '../css/Main.css';
import '../App.css';

const PostDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const location = useLocation();
    const [post, setPost] = useState<any>(null);
    const [topic, setTopic] = useState<any>(null);

    useEffect(() => {
        if (location.state && location.state.post && location.state.topic) {
            setPost(location.state.post);
            setTopic(location.state.topic);
        } else if (postId) {
            fetchPost(postId);
        }
    }, [postId]);

    const fetchPost = async (postId: string) => {
        try {
            const response = await axios.get(`/post/${postId}`);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post', error);
        }
    };

    return (
        <div className='main-container'>
            {topic && <div className='topic-banner'>
                <h2 className='banner-item'>{topic.name}</h2>
            </div>}
            {post ? (
                <div className='post-detail'>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p>Posted by {post.author.userName} on {new Date(post.createdAt).toLocaleString()}</p>
                    {/* Add comments section here */}
                </div>
            ) : (
                <p>Loading post...</p>
            )}
        </div>
    );
};

export default PostDetail;
