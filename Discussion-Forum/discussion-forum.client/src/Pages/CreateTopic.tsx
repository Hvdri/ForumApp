import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

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

    const handleCancel = () => {
        navigate(`/`);
    };

    return (
        <div className="create-container">
            <div className='create-content'>
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
                        placeholder="Topic content"
                        required
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
