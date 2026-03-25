import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id} in namespace: ${client.nsp.name}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToNotifications')
  handleSubscribe(client: Socket, data: any) {
    this.logger.log(`Client ${client.id} subscribed to admin-notifications room`);
    client.join('admin-notifications');
    return { event: 'subscribed', data: 'You are now subscribed to admin notifications' };
  }

  sendBookingNotification(bookingData: any) {
    this.logger.log(`Sending booking notification for booking ID: ${bookingData?.id}`);

    // Create a plain object to avoid circular reference issues from TypeORM entities
    const cleanData = JSON.parse(
      JSON.stringify(bookingData, (key, value) => {
        // Remove circular reference to 'booking' in bookingEmployees
        if (key === 'booking' && value && value.id === bookingData.id) {
          return undefined;
        }
        return value;
      }),
    );

    this.server.to('admin-notifications').emit('newBooking', cleanData);
    this.logger.log('Booking notification emitted');
  }
}
