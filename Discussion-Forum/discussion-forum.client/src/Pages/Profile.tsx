import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../App';
import '../css/Profile.css';
import axios from '../api/axiosConfig';

const Profile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const [newRole, setNewRole] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);

    useEffect(() => {
        if (userId) {
            fetchUser();
            fetchRoles();

            if (user) {
            setIsAdmin(user.roles.includes('Admin'));
            setAvailableRoles(roles.filter((role) => !user.roles.includes(role)));
            }
        }
    }, [userId, newRole]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`/user/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get('/roles');
            const rolesString = response.data.map((role: any) => role.name);
            setRoles(rolesString);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const addRole = async (role: string) => {
        try {
            const response = await axios.post(`/user/${userId}/role`,
                JSON.stringify(role),
                { headers: { 'Content-Type': 'application/json-patch+json' } }
            );
            setUser(response.data);
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };

    const removeRole = async (role: string) => {
        try {
            const response = await axios.delete(`/user/${userId}/role`, {
                headers: { 'Content-Type': 'application/json-patch+json' },
                data: JSON.stringify(role),
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    if (!user) {
        return (
            <div className="main-container">
                <h1>User Profile</h1>
                <p>You need to be logged in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="main-container">
            <h2>User Profile</h2>
            <div className="profile-details">
                <p>Username: {user.name}</p>
                <div>
                    <p>Roles:</p>
                    <div>
                        {(user.roles && user.roles.length > 0) ? user.roles.map((role, index) => (
                            <div key={index}>
                                <span>{role}</span>
                                {isAdmin && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removeRole(role)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        )) : 'User has no roles'}
                    </div>
                    {isAdmin && (
                        <div>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <option value="" disabled>Select a role to add</option>
                                {availableRoles.map((role, index) => (
                                    <option key={index} value={role}>{role}</option>
                                ))}
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    if (newRole) {
                                        addRole(newRole);
                                        setNewRole('');
                                    }
                                }}
                            >
                                Add Role
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
