import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import '../styles/Room.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const playerId = sessionStorage.getItem('playerId');
  const playerName = sessionStorage.getItem('playerName');

  useEffect(() => {
    if (!playerId) {
      navigate('/');
      return;
    }

    axios
      .get(`${API_URL}/api/room/${roomId}`)
      .then((response) => {
        const roomData = response.data;
        setRoom(roomData);
        setMembers(roomData.members);
        setIsHost(roomData.host === playerId);
        setLoading(false);
      })
      .catch((error) => {
        alert('Lỗi: ' + error.message);
        navigate('/');
      });

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.emit('joinRoom', { roomId, playerId });

    newSocket.on('memberJoined', (data) => {
      setMembers(data.members);
    });

    newSocket.on('gameStartedBroadcast', (data) => {
      setTimeout(() => {
        navigate(`/game/${roomId}`);
      }, 500);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, playerId, navigate]);

  const handleStartGame = async () => {
    if (members.length < 5) {
      alert('Cần ít nhất 5 người chơi để bắt đầu');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/game/start/${roomId}`, { playerId });
    } catch (error) {
      alert('Lỗi bắt đầu game: ' + error.response?.data?.error);
    }
  };

  if (loading) {
    return (
      <div className="room-container">
        <div className="loading">⏳ Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="room-container">
      <div className="room-card">
        <div className="room-header">
          <h1>🐺 Phòng: {room?.roomName}</h1>
          <div className="room-id">
            <span>ID: <strong>{roomId}</strong></span>
            <button
              className="btn-copy"
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                alert('Đã copy ID phòng!');
              }}
            >
              📋 Copy
            </button>
          </div>
        </div>

        <div className="room-info">
          <p>👥 Số người: <strong>{members.length}/15</strong></p>
          <p>🎮 Trạng thái: <strong>{room?.status === 'waiting' ? '⏸️ Chờ' : '▶️ Đang chơi'}</strong></p>
        </div>

        <div className="members-section">
          <h2>📋 Danh sách thành viên</h2>
          <div className="members-list">
            {members.map((member, index) => (
              <div key={member.playerId} className="member-item">
                <div className="member-number">{index + 1}</div>
                <div className="member-info">
                  <span className="member-name">{member.playerName}</span>
                  {member.playerId === room?.host && (
                    <span className="badge-host">👑 Chủ phòng</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isHost && room?.status === 'waiting' && (
          <div className="action-buttons">
            <button
              className="btn btn-primary btn-large"
              onClick={handleStartGame}
              disabled={members.length < 5}
            >
              ▶️ Bắt Đầu Trò Chơi
            </button>
          </div>
        )}

        {!isHost && (
          <div className="waiting-message">
            ⏳ Chờ chủ phòng bắt đầu trò chơi...
          </div>
        )}
      </div>
    </div>
  );
}

export default Room;