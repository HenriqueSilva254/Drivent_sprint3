import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotel(): Promise<Hotel[]> {
  return await prisma.hotel.findMany();
}

async function findHotelById(id: number): Promise<Hotel> {
  return await prisma.hotel.findFirst({
    where: { id },
    include: { Rooms: true },
  });

}

export const hotelsRepository = { findAllHotel, findHotelById };
