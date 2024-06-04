import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMessage, faUser, faCircle, faEllipsis, faSort, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import '../css/Main.css';
import '../App.css';

const Posts = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [topic, setTopic] = useState<any>(null);
    const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleEllipsisClick = (postId: string) => {
        setVisibleDropdown((prev) => (prev === postId ? null : postId));
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setVisibleDropdown(null);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSortOrderChange = () => {
        setSortOrder((prevOrder) => (prevOrder === 'newest' ? 'oldest' : 'newest'));
    };

    const filteredPosts = posts.filter(
        (post: any) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPosts = filteredPosts.sort((a: any, b: any) => {
        if (sortOrder === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
    });

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='main-container'>
            <div className='topic-banner'>
                <div className='banner-item'>
                    <div className='banner-title-icon'>
                        <FontAwesomeIcon className='banner-icon' icon={faMessage} />
                        {topic && <h2 className='banner-name'>{topic.name}</h2>}
                    </div>
                    <div className='banner-button-container'>
                        <button className='banner-group-item' onClick={() => navigate(`/topic/${topicId}/create-post`)}>
                            <FontAwesomeIcon className='banner-icon' icon={faPlus} />Create a post
                        </button>
                    </div>
                </div>
                <div className='banner-description'>
                    {topic && <p>{topic.description}</p>}
                </div>
            </div>

            <div className='search-container'>
                    <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} />
                    <input
                        type='text'
                        placeholder='Search Post by title or author...'
                        value={searchTerm}
                        onChange={handleSearch}
                        className='search-bar'
                    />
                <button className='sort-button' onClick={handleSortOrderChange}>
                    <FontAwesomeIcon icon={faSort} />
                    {sortOrder === 'newest' ? ' Sort by Oldest' : ' Sort by Newest'}
                </button>
            </div>

            {sortedPosts.length > 0 ? (
                sortedPosts.map((post: any) => (
                    <div className='post-container' key={post.id}>
                        <li onClick={() => handlePostClick(post)} className='post-body'>
                            <div className='post-header'>
                                <p><FontAwesomeIcon icon={faUser} /></p>
                                <p>{post.author.userName}</p>
                                <p><FontAwesomeIcon icon={faCircle} /></p>
                                <p>{new Date(post.createdAt).toLocaleString()}</p>
                                <div className='post-button' ref={dropdownRef}>
                                    <button onClick={(e) => { e.stopPropagation(); handleEllipsisClick(post.id); }}>
                                        <FontAwesomeIcon icon={faEllipsis} />
                                    </button>
                                    {visibleDropdown === post.id && (
                                        <div className='dropdown-menu'>
                                            <div className='dropdown-item' onClick={() => handleDeletePost(post.id)}>Delete</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                            </div>
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
