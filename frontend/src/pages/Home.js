import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <img
                    className="h-20 mx-auto mb-6"
                    src="/text.png"
                    alt="CodeBuddy Logo"
                />
                <h4 className="text-lg font-semibold text-center mb-4">Paste invitation ROOM ID</h4>
                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button
                        className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        onClick={joinRoom}
                    >
                        Join
                    </button>
                    <p className="text-center text-sm text-gray-400">
                        If you don't have an invite, create &nbsp;
                        <button
                            onClick={createNewRoom}
                            className="text-green-400 underline hover:text-green-500 cursor-pointer"
                        >
                            a new room
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
