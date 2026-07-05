import { io, Socket } from 'socket.io-client';

// Use server origin for WebSocket connection. Namespace is /notifications.
// In dev we connect to current origin (handled by Vite proxy), in prod we use same host.
const getSocketUrl = () => {
  // If dev, proxy is configured on same port (http://localhost:5174/socket.io) -> target http://localhost:3000
  // If prod, relative path to origin is used.
  return '/notifications';
};

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

    // Connect to the base origin (e.g. http://localhost:5174) with namespace /notifications
    // This allows Vite proxy for /socket.io to intercept it correctly.
    const origin = window.location.origin;
    this.socket = io(`${origin}/notifications`, {
      transports: ['websocket', 'polling'],
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
      console.log('Current SOCKET_URL:', getSocketUrl());
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
