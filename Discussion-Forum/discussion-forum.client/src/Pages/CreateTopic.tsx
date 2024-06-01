import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import '../css/CreateTopic.css';
import '../App.css';

const CreateTopic = () => {
    const [newTopic, setNewTopic] = useState({ name: '', description: '' });
    const navigate = useNavigate();

    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/topic', newTopic);
            const createdTopicId = response.data.id; // Assuming the created topic ID is returned
            setNewTopic({ name: '', description: '' });
            navigate(`/topic/${createdTopicId}`);
        } catch (error) {
            console.error('Error creating topic', error);
        }
    };

    return (
        <div className="create-topic-container">
            <div className='create-topic-content'>
            <h2>Create a New Topic</h2>
            <form onSubmit={handleCreateTopic}>
                <label>Topic Name</label>
                <input
                    type="text"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                    placeholder="Topic name"
                    required
                />
                <label>Topic Content</label>
                <textarea
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                    placeholder="Topic description"
                    required
                ></textarea>
                <div className='button-group'>
                <button type="reset">Cancel</button>
                <button type="submit">Create Topic</button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default CreateTopic;
