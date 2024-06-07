import './App.css';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import CreateTopic from './pages/CreateTopic';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import { useEffect, useState } from 'react';
import axios from './api/axiosConfig';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';

import AuthLayout from './layout/AuthLayout';
import MainLayout from './layout/MainLayout';

export interface User {
    id: string;
    name: string;
    roles: string[];
}

function App() {
    
    const [topics, setTopics] = useState([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchTopics();
        fetchUser();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await axios.get('/topic');
            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics', error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get('/user/current');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user', error);
        }
    };
    const updateTopics = async () => {
        await fetchTopics();
    };
    return (
        <BrowserRouter>
            <Navbar user={user} setUser={setUser} />
            <Routes>

                <Route path="/login" element={<AuthLayout><Login setUser={setUser}/></AuthLayout>} />
                <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
                <Route path="/" element={<MainLayout topics={topics}><Home /></MainLayout>} />
                <Route path="/create-topic" element={<MainLayout topics={topics}><PrivateRoute element={() => <CreateTopic updateTopics={updateTopics} />} /></MainLayout>} />
                <Route path="/topic/:topicId/create-post" element={<MainLayout topics={topics}><PrivateRoute element={CreatePost} /></MainLayout>} />
                <Route path="/post/:postId" element={<MainLayout topics={topics}><PostDetail user={user} /></MainLayout>} />
                <Route path="/topic/:topicId" element={<MainLayout topics={topics}><Posts user={user} updateTopics={updateTopics} /></MainLayout>} />
                <Route path="/profile/:userId" element={<MainLayout topics={topics}><Profile /></MainLayout>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
