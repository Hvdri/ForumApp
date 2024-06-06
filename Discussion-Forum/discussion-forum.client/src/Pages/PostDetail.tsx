import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import { User } from '../App';


import '../css/Main.css';
import '../App.css';

interface Comment {
    id: string;
    content: string;
    author: {
        userName: string;
        id: string;
    };
    createdAt: string;
}

interface PostsDetailProps {
    user: User | null;
}

const PostDetail: React.FC<PostsDetailProps> = ({ user }) => {
    const { postId } = useParams<{ postId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [post, setPost] = useState<any>(null);
    const [topic, setTopic] = useState<any>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            setComments(comments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment', error);
        }
    };

    const canDeleteComment = (comment: Comment) => {
        if (!user) return false;
        return user.id === comment.author.id || user.roles.includes('Admin') || user.roles.includes('Moderator');
    }

    const handleEllipsisClick = (commentId: string) => {
        setVisibleDropdown((prev) => (prev === commentId ? null : commentId));
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setVisibleDropdown(null);
        }
    };

    const handleUserClick = (userId: string) => {
        navigate(`/profile/${userId}`);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='main-container'>
            {topic && <div className='topic-banner'>
                <div className='banner-item'>
                    <div className='banner-title-icon'>
                        <FontAwesomeIcon className='banner-icon' icon={faMessage} />
                        <h2 className='banner-name'>{topic.name}</h2>
                    </div>
                </div>
                <div className='banner-description'>
                    <p>{topic.description}</p>
                </div>
            </div>}
            {post ? (
                <div className='post-container'>
                    <li className='post-body-detail'>
                        <div className='post-header'>
                            <p><FontAwesomeIcon icon={faUser} /></p>
                            <p>{post.author.userName}</p>
                            <p><FontAwesomeIcon icon={faCircle} /></p>
                            <p>{new Date(post.createdAt).toLocaleString()}</p>
                            <button className='view-profile-button' onClick={(e) => { e.stopPropagation(); handleUserClick(post.author.id); }}>
                                View Profile
                            </button>
                        </div>
                        <div>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                        </div>
                    </li>
                    <p className='line'></p>

                    <div className='create-comment'>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Write a comment...'
                        />
                        <div className='button-container'>
                            <button onClick={handleCreateComment}>Post Comment</button>
                        </div>
                    </div>
                    <div className='post-container'>
                        {comments.length > 0 ? (
                            comments.map((comment: Comment) => (
                                <li className='post-body-detail'>
                                    <div key={comment.id} className='post-header'>
                                        <p><FontAwesomeIcon icon={faUser} /></p>
                                        <p>{comment.author.userName}</p>
                                        <p><FontAwesomeIcon icon={faCircle} /></p>
                                        <p>{new Date(comment.createdAt).toLocaleString()}</p>
                                        <button className='view-profile-button' onClick={(e) => { e.stopPropagation(); handleUserClick(post.author.id); }}>
                                            View Profile
                                        </button>
                                        <div className='post-button'>
                                            <button onClick={(e) => { e.stopPropagation(); handleEllipsisClick(comment.id); }}>
                                                <FontAwesomeIcon icon={faEllipsis} />
                                            </button>
                                            {visibleDropdown === comment.id && (
                                                <div className='dropdown-menu'>
                                                    {canDeleteComment(comment) && <div className='dropdown-item' onClick={() => handleDeleteComment(comment.id)}>Delete</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p>{comment.content}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No comments yet</p>
                        )}

                    </div>
                </div>
            ) : (
                <p>Loading post...</p>
            )}
        </div>
    );
};

export default PostDetail;
