// lib/getCurrentUser.ts

import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getCurrentUser(req: Request) {
  const authHeader = req.headers.get('authorization');
  console.log('🚀 ~ getCurrentUser ~ getCurrentUser: 1');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  console.log('🚀 ~ getCurrentUser ~ getCurrentUser: 2');
  const token = authHeader.split(' ')[1];
  console.log('🚀 ~ getCurrentUser ~ getCurrentUser: 3');
  try {
    console.log('🚀 ~ getCurrentUser ~ getCurrentUser: 4');
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
    };
    console.log('🚀 ~ getCurrentUser ~ getCurrentUser: 5');
    const user = await prisma.user_information.findUnique({
      where: {
        user_id: decoded.id,
      },
    });

    return user;
  } catch (error) {
    console.error('Error occurred while fetching current user:', error);
    return null;
  }
}
