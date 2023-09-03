import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
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
  async handleMessage(client: Socket, content: string): Promise<void> {
    await this.chatService.saveMessage(content);
    this.server.emit('message', content);
  }

  @SubscribeMessage('loadMessages')
  async loadMessages(): Promise<void> {
    const messages = await this.chatService.getMessages();
    this.server.emit('loadMessages', messages);
  }
}
