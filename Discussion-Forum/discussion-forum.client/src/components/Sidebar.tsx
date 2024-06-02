import { useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
const Sidebar = ({ topics }: { topics: any[] }) => {
    const navigate = useNavigate();

    const handleTopicClick = (topicId: string) => {
        navigate(`/topic/${topicId}`);
    };

    return (
        <div className='sidebar-container'>
            <h3>Topics</h3>
            <div className='topic' onClick={() => navigate('/create-topic')}>
            <FontAwesomeIcon icon={faPlus} /> Create a topic
            </div>
            {topics.map((topic: any) => (
                <li key={topic.id}>
                    <div className='topic' onClick={() => handleTopicClick(topic.id)}>{topic.name}</div>
                </li>
            ))}
        </div>
    );
};

export default Sidebar;
