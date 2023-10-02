import { Hotel, Room } from '@prisma/client';
import faker from '@faker-js/faker';
import { generateValidToken } from '../helpers';
import { createEnrollmentWithAddress } from './enrollments-factory';
import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createHotel(): Promise<Hotel> {
  return await prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.business(),
    },
  });
}

export async function createRoom(hotelId: number): Promise<Room> {
  return await prisma.room.create({
    data: {
      name: faker.address.buildingNumber(),
      capacity: 3,
      hotelId,
    },
  });
}

export async function createScenarioHotel() {
  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollment = await createEnrollmentWithAddress(user);
  const result = { token, enrollment };
  return result;
}
