import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { createTicket, createTicketTypespecific, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createRoom, createScenarioHotel } from '../factories/hotel-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 when user doesnt have enrollment yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when tikect status is RESERVED', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(false, false);

    await createTicket(scenario.enrollment.id, tikecType.id, 'RESERVED');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when tikect remote is true', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(true, false);

    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when tikect remote is true and hotel is include', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(true, true);

    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when tikect hotel no include', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(false, false);
    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 when tikect status PAID, hotel include', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(false, true);
    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');
    const hotel = await createHotel();
    await createRoom(hotel.id);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }),
      ]),
    );
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 when user doesnt have enrollment yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when tikect status is RESERVED', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(false, false);

    await createTicket(scenario.enrollment.id, tikecType.id, 'RESERVED');

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when tikect remote is true', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(true, false);

    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when tikect remote is true and hotel is include', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(true, true);

    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when tikect hotel no include', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(false, false);
    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');
    const hotel = await createHotel();

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 when params is correct', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(false, true);
    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');
    const hotel = await createHotel();
    const room = await createRoom(hotel.id)
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: hotel.name,
      image: hotel.image,
      createdAt: hotel.createdAt.toISOString(),
      updatedAt: hotel.updatedAt.toISOString(),
      Rooms: [
        {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: hotel.id,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      ],
    });    
  });

  it('should respond with status 404 when there is no hotel', async () => {
    const scenario = await createScenarioHotel();
    const tikecType = await createTicketTypespecific(false, true);
    await createTicket(scenario.enrollment.id, tikecType.id, 'PAID');
    await createHotel();

    const response = await server.get('/hotels/2').set('Authorization', `Bearer ${scenario.token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});
