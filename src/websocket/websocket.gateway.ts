import {
  OnGatewayConnection,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppWebSocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  sendJobUpdate(jobId: string, status: string, data?: any) {
    this.server.emit(`job:${jobId}`, { status, data });
  }
}
