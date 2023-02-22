import { Injectable } from '@nestjs/common';
import { Venue } from './models/venue.model';

@Injectable()
export class VenuesService {
  async findAll(): Promise<Venue[]> {
    return [];
  }
}
