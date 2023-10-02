import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services/hotels-service';

async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await hotelService.allHotels(userId);
  res.status(httpStatus.OK).send(result);
}

async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  const result = await hotelService.HotelsID(userId, Number(hotelId));
  res.status(httpStatus.OK).send(result);
}
export const hotelsController = { getAllHotels, getHotelsById };
