import { useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faFaceKissBeam } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick}>
        <FontAwesomeIcon icon={faFaceKissBeam} className='icon' />
      </div>
      <div className="navbar-user">
        <FontAwesomeIcon icon={faUser} className='icon' />
      </div>
    </div>
  );
};

export default Navbar;
