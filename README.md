# 🐺 Game Ma Sói Online

Trò chơi Ma sói online cho khoảng 15 người chơi.

## 🎮 Tính năng

- ✅ Tạo/Tham gia phòng chơi với ID
- ✅ Danh sách thành viên real-time cho chủ phòng
- ✅ Phân vai trò tự động khi bắt đầu
- ✅ Hiển thị vai trò + chức năng bằng Tiếng Việt
- ✅ Vòng ngày/đêm tự động
- ✅ Giao diện đơn giản, mobile-friendly

## 🎭 Các Vai Trò

1. **🐺 Ma Sói** - Mỗi đêm giết 1 dân làng
2. **👨‍🌾 Dân Làng** - Vote loại người (không có khả năng đặc biệt)
3. **🔮 Tiên Tri** - Mỗi đêm xem 1 người là ma sói hay dân làng
4. **🛡️ Bảo Vệ** - Mỗi đêm bảo vệ 1 người khỏi bị giết
5. **💍 Tình Nhân** - Biết danh tính nhau (cặp 2 người), nếu 1 chết cả 2 đều chết
6. **👻 Thợ Săn** - Khi bị loại vote có thể giết 1 người khác
7. **🎪 Thầy Bùa** - Mỗi đêm "tra tấn" 1 người
8. **🔔 Chuông Báo** - Được phát hiện khi bị giết
9. **👑 Thị Trưởng** - Vote được tính 2 lần
10. **🎭 Ngoại Tình** - Chỉ định 1 người không được giết
11. **🕵️ Thám Tử** - Xem 2 người, chọn 1 để xác nhận

## 🚀 Cài đặt

### Yêu cầu
- Node.js 16+
- MongoDB Atlas (free tier)

### Setup Local

```bash
# Clone repo
git clone https://github.com/thanhphucvo2805-sudo/ma-soi.git
cd ma-soi

# Cài dependencies
cd server && npm install
cd ../client && npm install
cd ..

# Tạo file .env
echo "MONGODB_URI=mongodb+srv://..." > server/.env
echo "PORT=5000" >> server/.env

# Chạy dev
npm run dev
```

## 🌐 Deploy trên Render

### Backend
1. Push code lên GitHub
2. Tạo Web Service trên Render.com
3. Kết nối repository
4. Set environment variables: `MONGODB_URI`, `PORT`
5. Deploy

### Frontend
1. Build: `npm run build`
2. Deploy static site trên Render
3. Cấu hình environment: `VITE_API_URL=<backend-url>`

## 📝 Luật Chơi

### Ngày
- Mọi người thảo luận và vote loại 1 người
- Người bị vote nhiều nhất bị loại

### Đêm
- Ma sói chọn nạn nhân
- Tiên tri xem 1 người
- Bảo vệ bảo vệ 1 người
- Các vai trò khác thực hiện kỹ năng

### Thắng
- **Ma sói thắng**: Khi ma sói >= dân làng
- **Dân làng thắng**: Khi tất cả ma sói bị loại

## 📄 License

MIT