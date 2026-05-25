import { prisma } from '@/lib/prisma';

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// Demo-only: remove once NextAuth session provides the user id directly
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
