import { Ticket, TicketType } from '@prisma/client';
import { ticketsService } from './tickets-service';
import { hotelsRepository } from '@/repositories/hotels-repository';
import { notFoundError } from '@/errors';
import { hotelNoinclude, paymentRequired, ticketRemote } from '@/errors/payment-required';

async function allHotels(userId: number) {
  const tiket = await ticketsService.getTicketByUserId(userId);

  errosHotel(tiket);

  const hotels = await hotelsRepository.findAllHotel();
  if (hotels.length === 0)  notFoundError();
  return hotels;
}

async function HotelsID(userId: number, hotelId: number) {
  const tiket = await ticketsService.getTicketByUserId(userId);
 
  errosHotel(tiket);
  
  const hotels = await hotelsRepository.findHotelById(hotelId);
  if (!hotels) throw notFoundError();
  return hotels;
}

function errosHotel(tiket: Ticket & { TicketType: TicketType }) {
  if (tiket.status === 'RESERVED') throw paymentRequired();
  if (tiket.TicketType.isRemote === true) throw ticketRemote();
  if (tiket.TicketType.includesHotel === false) throw hotelNoinclude();
}

export const hotelService = { allHotels, HotelsID };
