import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const [topics, setTopics] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [newTopic, setNewTopic] = useState({ name: '', content: '' });
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    useEffect(() => {
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

    const handleTopicClick = async (topicId: string) => {
        setSelectedTopic(topicId);
        try {
            const response = await axios.get(`/topic/${topicId}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/topic', newTopic);
            setNewTopic({ name: '', content: '' });
            fetchTopics();
        } catch (error) {
            console.error('Error creating topic', error);
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        try {
            await axios.delete(`/topic/${topicId}`);
            setSelectedTopic(null);
            setPosts([]);
            fetchTopics();
        } catch (error) {
            console.error('Error deleting topic', error);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTopic) return;

        try {
            await axios.post('/post', { ...newPost, topicId: selectedTopic });
            setNewPost({ title: '', content: '' });
            handleTopicClick(selectedTopic);
        } catch (error) {
            console.error('Error creating post', error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await axios.delete(`/post/${postId}`);
            if (selectedTopic) handleTopicClick(selectedTopic);
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    return (
        <div>
            <h2>Welcome to the Home Page</h2>
            <button onClick={handleLogout}>Logout</button>
            <div>
                <h2>Topics</h2>
                <form onSubmit={handleCreateTopic}>
                    <input
                        type="text"
                        value={newTopic.name}
                        onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                        placeholder="Topic name"
                        required
                    />
                    <textarea
                        value={newTopic.content}
                        onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                        placeholder="Topic content"
                        required
                    ></textarea>
                    <button type="submit">Create Topic</button>
                </form>
                <ul>
                    {topics.map((topic: any) => (
                        <li key={topic.id}>
                            <span onClick={() => handleTopicClick(topic.id)}>{topic.name}</span>
                            <button onClick={() => handleDeleteTopic(topic.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                {selectedTopic && (
                    <div>
                        <h2>Posts</h2>
                        <form onSubmit={handleCreatePost}>
                            <input
                                type="text"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                placeholder="Post title"
                                required
                            />
                            <textarea
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                placeholder="Post content"
                                required
                            ></textarea>
                            <button type="submit">Create Post</button>
                        </form>
                        <ul>
                            {posts.length > 0 ? (
                                posts.map((post: any) => (
                                    <li key={post.id}>
                                        <h3>{post.title}</h3>
                                        <p>{post.content}</p>
                                        <p>Posted by {post.author.userName} on {new Date(post.createdAt).toLocaleString()}</p>
                                        <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                                    </li>
                                ))
                            ) : (
                                <p>No posts in current topic</p>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
