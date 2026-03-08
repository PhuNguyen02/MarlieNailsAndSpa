import { io, Socket } from 'socket.io-client';

// Sử dụng relative path để tận dụng proxy của Vite trong development
// hoặc domain chính trong production. Namespace là /notifications
const SOCKET_URL = '/notifications';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) {
      if (this.socket.connected) {
        console.log('Socket already connected, ensuring subscription...');
        this.socket.emit('subscribeToNotifications');
      }
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], // Cho phép fallback polling nếu websocket bị chặn
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Successfully connected to notification socket! Socket ID:', this.socket?.id);
      // Subscribe vào room admin-notifications sau khi kết nối
      console.log('Sending subscribeToNotifications event...');
      this.socket?.emit('subscribeToNotifications');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification socket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      console.log('Current SOCKET_URL:', SOCKET_URL);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
