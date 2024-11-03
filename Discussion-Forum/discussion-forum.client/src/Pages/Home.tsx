import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../css/Home.css'

const Home = () => {

    return (
        <div className='home-container'>
            <div className='home-header'>
                <h3>Welcome to our</h3>
                <h2>Amazing Discussion Forum</h2>
            </div>
            <div className='home-icons-container'>
                <FontAwesomeIcon className='home-icon' icon={faArrowLeft} />
                <FontAwesomeIcon className='home-icon' icon={faArrowLeft} />
                <FontAwesomeIcon className='home-icon' icon={faArrowLeft} />
            </div>
            <div className="home-content">
                <div>Select a topic to view posts</div>
            </div>
        </div>
    );
};

export default Home;
