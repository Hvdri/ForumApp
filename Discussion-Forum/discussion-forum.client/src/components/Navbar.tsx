import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faFaceKissBeam } from '@fortawesome/free-solid-svg-icons';
import '../css/Navbar.css';
import axios from '../api/axiosConfig';

import { User } from '../App';

interface NavbarProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleUserClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/user/current', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser]);

  return (
    <div className="navbar">
      <div className="navbar-logo" onClick={handleLogoClick}>
        <FontAwesomeIcon icon={faFaceKissBeam} className="icon" />
      </div>
      <div className="navbar-user" onClick={handleUserClick} ref={dropdownRef}>
        <FontAwesomeIcon icon={faUser} className="icon" />
        {dropdownVisible && (
          <div className="dropdown-menu">
            {user ? (
              <>
                <div className="dropdown-item">{user.name}</div>
                <div className="dropdown-item">{user.roles.join(', ')}</div>
                <div className="dropdown-item" onClick={handleLogout}>Logout</div>
              </>
            ) : (
              <div className="dropdown-item" onClick={() => navigate('/login')}>Login</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
