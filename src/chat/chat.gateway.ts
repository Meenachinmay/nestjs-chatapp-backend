import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(private chatService: ChatService) {}

  async afterInit(server: Server) {
    this.logger.log('WebSocket Initialized');
    const messages = await this.chatService.getMessages();
    this.server.emit('loadMessages', messages);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleChatEvent(
    client: any,
    payload: { content: string; username: string },
  ) {
    const message = await this.chatService.saveMessage(
      payload.username,
      payload.content,
    );
    this.server.emit('message', message);
  }

  @SubscribeMessage('loadMessages')
  async loadMessages(): Promise<void> {
    const messages = await this.chatService.getMessages();
    this.server.emit('loadMessages', messages);
  }
}
