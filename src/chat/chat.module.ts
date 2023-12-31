import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ChatService, ChatGateway, PrismaService],
})
export class ChatModule {}
