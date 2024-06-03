import { useState, useEffect } from 'react';
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
            const response = await axios.post('/post', { ...newPost, topicId });
            navigate(`/post/${response.data.id}`);
        } catch (error) {
            console.error('Error creating post', error);
        }
    };

    const handleCancel = () => {
        navigate(`/topic/${topicId}`);
    };

    return (
        <div className="create-container">
            <div className="create-content">
                <h2>Create a New Post in "{topicName}"</h2>
                <form onSubmit={handleCreatePost}>
                    <label>Post Title</label>
                    <input
                        type="text"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="Post title"
                        required
                    />
                    <label>Post Content</label>
                    <textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Post content"
                        required
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
