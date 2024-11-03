import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCircle, faMessage, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { User } from '../App';
import '../css/Main.css';
import '../App.css';

interface Author {
    userName: string;
    id: string;
    createdAt: string;
    lastUpdatedAt: string;
    lastLogin: string;
    email: string;
    normalizedUserName: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumber: string | null;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: string | null;
    lockoutEnabled: boolean;
    accessFailedCount: number;
}

interface Topic {
    id: string;
    name: string;
    description: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
    author: Author;
    createdAt: string;
    topicId: string;
    topic: Topic;
}

interface Comment {
    id: string;
    content: string;
    author: Author;
    createdAt: string;
    postId: string;
}

interface PostsDetailProps {
    user: User | null;
}

const PostDetail: React.FC<PostsDetailProps> = ({ user }) => {
    const { postId } = useParams<{ postId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [topic, setTopic] = useState<Topic | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [editingPost, setEditingPost] = useState(false);
    const [editingPostContent, setEditingPostContent] = useState('');
    const [editingPostTitle, setEditingPostTitle] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
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

    const handleEditPost = () => {
        if (post) {
            setEditingPost(true);
            setEditingPostTitle(post.title);
            setEditingPostContent(post.content);
        }
    };

    const handleUpdatePost = async () => {
        if (!editingPostTitle.trim() || !editingPostContent.trim() || !post) return;

        try {
            await axios.put(`/post/${post.id}`, {
                Id: post.id,
                Title: editingPostTitle,
                Content: editingPostContent,
                AuthorId: post.author.id,
                author: post.author,
                TopicId: post.topicId,
                topic: post.topic,
            });
            setPost({
                ...post,
                title: editingPostTitle,
                content: editingPostContent,
            });
            setEditingPost(false);
        } catch (error) {
            console.error('Error updating post', error);
        }
    };

    const handleDeletePost = async () => {
        if (!post) return;

        try {
            await axios.delete(`/post/${post.id}`);
            navigate(-1);
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    const handleEditComment = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentContent(comment.content);
    };

    const handleUpdateComment = async (comment: Comment) => {
        if (!editingCommentContent.trim()) return;

        try {
            await axios.put(`/comment/${comment.id}`, {
                id: comment.id,
                content: editingCommentContent,
                postId: comment.postId,
                authorId: comment.author.id,
                author: comment.author,
            });
            setComments(comments.map((c) =>
                c.id === comment.id ? { ...c, content: editingCommentContent } : c
            ));
            setEditingCommentId(null);
            setEditingCommentContent('');
        } catch (error) {
            console.error('Error updating comment', error);
        }
    };

    const canEditOrDelete = (authorId: string) => {
        if (!user) return false;
        return user.id === authorId || user.roles.includes('Admin') || user.roles.includes('Moderator');
    };

    const handleEllipsisClick = (id: string) => {
        setVisibleDropdown((prev) => (prev === id ? null : id));
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
                            <div className='post-button'>
                                <button onClick={(e) => { e.stopPropagation(); handleEllipsisClick(post.id); }}>
                                    <FontAwesomeIcon icon={faEllipsis} />
                                </button>
                                {visibleDropdown === post.id && (
                                    <div className='dropdown-menu'>
                                        {canEditOrDelete(post.author.id) && <div className='dropdown-item' onClick={handleEditPost}>Edit</div>}
                                        {canEditOrDelete(post.author.id) && <div className='dropdown-item' onClick={handleDeletePost}>Delete</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                        {editingPost ? (
                            <div className='edit-post'>
                                <input
                                    type='text'
                                    value={editingPostTitle}
                                    onChange={(e) => setEditingPostTitle(e.target.value)}
                                />
                                <textarea
                                    value={editingPostContent}
                                    onChange={(e) => setEditingPostContent(e.target.value)}
                                    className='expanding-textarea'
                                />
                                <div className='button-container'>
                                    <button onClick={handleUpdatePost}>Update</button>
                                    <button onClick={() => setEditingPost(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                            </div>
                        )}
                    </li>
                    <p className='line'></p>
                    <div className='create-comment'>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Write a comment...'
                            className="expanding-textarea"
                        />
                        <div className='button-container'>
                            <button onClick={handleCreateComment}>Post Comment</button>
                        </div>
                    </div>
                    <div className='post-container'>
                        {comments.length > 0 ? (
                            comments.map((comment: Comment) => (
                                <li key={comment.id} className='post-body-detail'>
                                    <div className='post-header'>
                                        <p><FontAwesomeIcon icon={faUser} /></p>
                                        <p>{comment.author.userName}</p>
                                        <p><FontAwesomeIcon icon={faCircle} /></p>
                                        <p>{new Date(comment.createdAt).toLocaleString()}</p>
                                        <button className='view-profile-button' onClick={(e) => { e.stopPropagation(); handleUserClick(comment.author.id); }}>
                                            View Profile
                                        </button>
                                        <div className='post-button'>
                                            <button onClick={(e) => { e.stopPropagation(); handleEllipsisClick(comment.id); }}>
                                                <FontAwesomeIcon icon={faEllipsis} />
                                            </button>
                                            {visibleDropdown === comment.id && (
                                                <div className='dropdown-menu'>
                                                    {canEditOrDelete(comment.author.id) && <div className='dropdown-item' onClick={() => handleEditComment(comment)}>Edit</div>}
                                                    {canEditOrDelete(comment.author.id) && <div className='dropdown-item' onClick={() => handleDeleteComment(comment.id)}>Delete</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {editingCommentId === comment.id ? (
                                            <div className='edit-comment'>
                                                <textarea
                                                    value={editingCommentContent}
                                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                                    className='expanding-textarea'
                                                />
                                                <div className='button-container'>
                                                    <button onClick={() => handleUpdateComment(comment)}>Update</button>
                                                    <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p>{comment.content}</p>
                                        )}
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
