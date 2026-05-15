import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import '../styles/Game.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROLE_DESCRIPTIONS = {
  'ma_soi': {
    name: '🐺 Ma Sói',
    description: 'Mỗi đêm, bạn và các Ma sói khác sẽ bỏ phiếu để chọn 1 người để giết. Mục tiêu là giết tất cả dân làng.'
  },
  'dan_lang': {
    name: '👨‍🌾 Dân Làng',
    description: 'Bạn là một dân làng bình thường. Mỗi ngày, cộng tác với những người chơi khác để bỏ phiếu loại những Ma sói. Mục tiêu là tiêu diệt tất cả Ma sói.'
  },
  'tien_tri': {
    name: '🔮 Tiên Tri',
    description: 'Mỗi đêm, bạn có thể chỉ ra 1 người chơi để xem họ là Ma sói hay Dân làng. Sử dụng khả năng này một cách khôn ngoan!'
  },
  'bao_ve': {
    name: '🛡️ Bảo Vệ',
    description: 'Mỗi đêm, bạn có thể chỉ định 1 người để bảo vệ khỏi bị giết bởi Ma sói. Bạn không thể bảo vệ cùng một người hai đêm liên tiếp.'
  },
  'tinh_nhan': {
    name: '💍 Tình Nhân',
    description: 'Bạn biết danh tính của người yêu (một người chơi khác). Nếu một trong hai bạn bị giết, cả hai đều chết.'
  },
  'tho_san': {
    name: '👻 Thợ Săn',
    description: 'Khi bạn bị vote loại vào ban ngày, bạn có thể chỉ định 1 người khác để giết trước khi chết.'
  },
  'thay_bua': {
    name: '🎪 Thầy Bùa',
    description: 'Mỗi đêm, bạn có thể \"tra tấn\" 1 người chơi. Nếu là Ma sói, họ sẽ yếu đi và chỉ có thể giết 1 nửa người trong đêm tiếp theo.'
  },
  'chuong_bao': {
    name: '🔔 Chuông Báo',
    description: 'Khi bạn bị giết, danh tính của bạn sẽ được tiết lộ cho tất cả mọi người.'
  },
  'thi_truong': {
    name: '👑 Thị Trưởng',
    description: 'Bạn là người lãnh đạo thị trấn. Vote của bạn được tính gấp đôi khi bỏ phiếu loại người.'
  },
  'ngoai_tinh': {
    name: '🎭 Ngoại Tình',
    description: 'Mỗi đêm, bạn có thể chỉ định 1 người để họ không bị giết bởi Ma sói. Chỉ bạn biết bản thân có vai trò này.'
  },
  'tham_tu': {
    name: '🕵️ Thám Tử',
    description: 'Mỗi đêm, bạn được xem 2 người. Sau đó, bạn chọn 1 trong 2 người đó - nếu họ là Ma sói, bạn sẽ biết.'
  }
};

function Game() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [gameState, setGameState] = useState('loading');
  const [socket, setSocket] = useState(null);

  const playerId = sessionStorage.getItem('playerId');
  const playerName = sessionStorage.getItem('playerName');

  useEffect(() => {
    if (!playerId) {
      navigate('/');
      return;
    }

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on('gameStarted', (data) => {
      setRole(data.role);
      setGameState('playing');
    });

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', { roomId, playerId });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, playerId, navigate]);

  if (gameState === 'loading') {
    return (
      <div className="game-container">
        <div className="loading-screen">
          <h1>🎮 Đang tải trò chơi...</h1>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="game-container">
        <div className="loading-screen">
          <h1>⏳ Chờ phân vai trò...</h1>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const roleInfo = ROLE_DESCRIPTIONS[role];

  return (
    <div className="game-container">
      <div className="game-content">
        <div className="role-card">
          <div className="role-header">
            <h1>{roleInfo.name}</h1>
            <p className="player-info">👤 {playerName}</p>
          </div>

          <div className="role-description">
            <h2>Chức Năng của Vai Trò</h2>
            <p>{roleInfo.description}</p>
          </div>

          <div className="game-instructions">
            <h3>📋 Hướng Dẫn Chơi</h3>
            <ul>
              <li>🌞 <strong>Ban Ngày:</strong> Mọi người thảo luận và bỏ phiếu loại 1 người. Người bị vote nhiều nhất sẽ bị loại.</li>
              <li>🌙 <strong>Ban Đêm:</strong> Các vai trò đặc biệt sử dụng khả năng của họ (giết, bảo vệ, xem...).</li>
              <li>⚡ <strong>Chiến Thắng:</strong>
                <ul>
                  <li>Ma sói thắng: Khi số Ma sói >= số Dân làng</li>
                  <li>Dân làng thắng: Khi tất cả Ma sói bị loại</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="action-info">
            <h3>💡 Gợi Ý</h3>
            <p>Hãy sử dụng mạng xã hội ngoài trò chơi để thảo luận và quyết định danh tính của Ma sói!</p>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => {
              navigate('/');
            }}
          >
            ← Quay lại Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;