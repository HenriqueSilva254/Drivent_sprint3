import { ApplicationError } from '@/protocols';

export function paymentRequired(): ApplicationError {
  return {
    name: 'paymentRequired',
    message: 'Payment of ticket is Required!',
  };
}

export function hotelNoinclude(): ApplicationError {
  return {
    name: 'hotelNoinclude',
    message: 'Hotel No include on ticket!',
  };
}

export function ticketRemote(): ApplicationError {
  return {
    name: 'ticketRemote',
    message: 'Ticket is Remote!',
  };
}
