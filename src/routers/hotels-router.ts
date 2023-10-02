import { Router } from 'express';
import { hotelsController } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken);
hotelsRouter.get('/', hotelsController.getAllHotels);
hotelsRouter.get('/:hotelId', hotelsController.getHotelsById);

export { hotelsRouter };
