import { useNavigate } from 'react-router-dom';
import '../css/Main.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <header>
                <h2>Welcome to the Home Page</h2>
                <button onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }}>Logout</button>
            </header>
            <div className="content">
                <div>Select a topic to view posts</div>
            </div>
        </>
    );
};

export default Home;
