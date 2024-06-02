import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';

import '../css/Main.css';
import '../App.css';

const PostDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        if (postId) {
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
        <>
            {post ? (
                <>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p>Posted by {post.author.userName} on {new Date(post.createdAt).toLocaleString()}</p>
                    {/* Add comments section here */}
                </>
            ) : (
                <p>Loading post...</p>
            )}
        </>
    );
};

export default PostDetail;
