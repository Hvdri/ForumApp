import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';

import '../css/Main.css';
import '../App.css';
import '../css/CreateTopicPost.css';

const CreatePost = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [topicName, setTopicName] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchTopicDetails = async () => {
            try {
                const response = await axios.get(`/topic/${topicId}`);
                setTopicName(response.data.name);
            } catch (error) {
                console.error('Error fetching topic details', error);
            }
        };

        if (topicId) {
            fetchTopicDetails();
        }
    }, [topicId]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/post', { ...newPost, topicId });
            navigate(`/topic/${topicId}`);
        } catch (error) {
            console.error('Error creating post', error);
        }
    };

    const handleCancel = () => {
        navigate(`/topic/${topicId}`);
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewPost({ ...newPost, content: e.target.value });
        autoResizeTextArea();
    };

    const autoResizeTextArea = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    return (
        <div className="create-container">
            <div className="create-content">
                <p>Create a New Post in</p>
                <h2>{topicName}</h2>
                <form onSubmit={handleCreatePost}>
                    <label>Post Title</label>
                    <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="Post title..."
                        required
                    />
                    <label>Post Content</label>
                    <textarea
                        ref={textAreaRef}
                        value={newPost.content}
                        onChange={handleTextAreaChange}
                        placeholder="Post content..."
                        required
                        className="expanding-textarea"
                    ></textarea>
                    <div className="button-group">
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Create Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
