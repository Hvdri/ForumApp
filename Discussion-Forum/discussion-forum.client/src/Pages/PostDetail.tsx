import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from '../api/axiosConfig';

import '../css/Main.css';
import '../App.css';

interface Post {
    id: string;
    title: string;
    content: string;
    author: {
        userName: string;
    };
    createdAt: string;
}

interface Comment {
    id: string;
    content: string;
    author: {
        userName: string;
    };
    createdAt: string;
}

const PostDetail = () => {
    const { postId } = useParams<{ postId: string }>();
    const location = useLocation();
    const [post, setPost] = useState<Post | null>(null);
    const [topic, setTopic] = useState<any>(null); // You can replace 'any' with a more specific type if available
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (location.state && location.state.post && location.state.topic) {
            setPost(location.state.post);
            setTopic(location.state.topic);
        } else if (postId) {
            fetchPost(postId);
        }
        if (postId) {
            fetchComments(postId);
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

    const fetchComments = async (postId: string) => {
        try {
            const response = await axios.get(`/post/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments', error);
        }
    };

    const handleCreateComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`/post/${postId}/comment`, { content: newComment });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error creating comment', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await axios.delete(`/comment/${commentId}`);
            setComments(comments.filter((comment: any) => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment', error);
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
                    
                    {/* Comments Section */}
                    <div className='comments-section'>
                        <h3>Comments</h3>
                        {comments.length > 0 ? (
                            comments.map((comment: any) => (
                                <div key={comment.id} className='comment'>
                                    <p>{comment.content}</p>
                                    <p>Commented by {comment.author.userName} on {new Date(comment.createdAt).toLocaleString()}</p>
                                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet</p>
                        )}
                        
                        <div className='create-comment'>
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder='Write a comment...'
                            />
                            <button onClick={handleCreateComment}>Post Comment</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading post...</p>
            )}
        </div>
    );
};

export default PostDetail;
