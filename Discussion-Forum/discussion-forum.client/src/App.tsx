// App.tsx
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import CreateTopic from './pages/CreateTopic';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';
import axios from './api/axiosConfig';

import Navbar from './components/Navbar';

function App() {
    const [topics, setTopics] = useState([]);
    // const [user, setUser] = useState(null);

    // const fetchUser = async () => {
    //     try {
    //         const response = await axios.get('/user/current');
    //         setUser(response.data);
    //     } catch (error) {
    //         console.error('Error fetching user', error);
    //     }
    // }

    useEffect(() => {
        // fetchUser();
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await axios.get('/topic');
            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics', error);
        }
    };

    return (
        <BrowserRouter>
            <Navbar />
            <div className="app-container">
                <aside className="sidebar">
                    <Sidebar topics={topics} />
                </aside>
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create-topic" element={<PrivateRoute element={CreateTopic} />} />
                        <Route path="/topic/:topicId/create-post" element={<PrivateRoute element={CreatePost} />} />
                        <Route path="/post/:postId" element={<PostDetail />} />
                        <Route path="/topic/:topicId" element={<Posts />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
