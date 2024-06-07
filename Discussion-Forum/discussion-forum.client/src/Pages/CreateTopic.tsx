import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

import '../css/Main.css';
import '../App.css';
import '../css/CreateTopicPost.css';

const CreateTopic = ({ updateTopics }: { updateTopics: () => Promise<void> }) => {
    const [newTopic, setNewTopic] = useState({ name: '', description: '' });
    const navigate = useNavigate();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/topic', newTopic);
            const createdTopicId = response.data.id; // Assuming the created topic ID is returned
            setNewTopic({ name: '', description: '' });
            await updateTopics();
            navigate(`/topic/${createdTopicId}`);
        } catch (error) {
            console.error('Error creating topic', error);
        }
    };

    const handleCancel = () => {
        navigate(`/`);
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewTopic({ ...newTopic, description: e.target.value });
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
            <div className='create-content'>
                <p>Create a New Topic</p>
                <form onSubmit={handleCreateTopic}>
                    <label>Topic Name</label>
                    <input
                        type="text"
                        value={newTopic.name}
                        onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                        placeholder="Topic name..."
                        required
                    />
                    <label>Topic Content</label>
                    <textarea
                        ref={textAreaRef}
                        value={newTopic.description}
                        onChange={handleTextAreaChange}
                        placeholder="Topic content..."
                        required
                        className="expanding-textarea"
                    ></textarea>
                    <div className='button-group'>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                        <button type="submit">Create Topic</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTopic;
