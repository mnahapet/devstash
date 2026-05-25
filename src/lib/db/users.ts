import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getUserById = cache(async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
});

// Demo-only: remove once NextAuth session provides the user id directly
export const getUserByEmail = cache(async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
});
