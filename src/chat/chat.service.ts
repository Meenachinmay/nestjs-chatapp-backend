import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

export type MessageType = {
  id: number;
  content: string;
  userId: number;
  createdAt: Date;
};

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  async saveMessage(username: string, message: string) {
    // Upsert user
    const user = await this.prisma.user.upsert({
      where: { username },
      update: {},
      create: { username },
    });

    // Create message
    return await this.prisma.message.create({
      data: {
        content: message,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });
  }

  async getMessages() {
    return await this.prisma.message.findMany({
      include: {
        user: true,
      },
    });
  }
}
