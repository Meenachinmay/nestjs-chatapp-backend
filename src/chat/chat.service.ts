import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

export type MessageType = {
  id: number;
  content: string;
  createdAt: Date;
};

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(content: string): Promise<MessageType> {
    return await this.prisma.message.create({
      data: {
        content: content,
      },
    });
  }

  async getMessages(): Promise<string[]> {
    const messages = await this.prisma.message.findMany();
    return messages.map((message) => message.content);
  }
}
