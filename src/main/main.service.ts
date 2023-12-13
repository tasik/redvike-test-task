import { Injectable, NotFoundException } from '@nestjs/common';
import * as csvtojson from 'csvtojson/v2';
import * as path from 'path';
import * as dayjs from 'dayjs';

@Injectable()
export class MainService {
  async findByAmenityId(amenityId: number, timestamp: string): Promise<any> {
    const amenityData = await csvtojson({ delimiter: 'auto' }).fromFile(
      path.resolve(__dirname, '../../data/amenity.csv'),
    );

    const amenity = amenityData.find((e) => e.id == amenityId);

    if (!amenity) {
      throw new NotFoundException();
    }

    const reservationData = await csvtojson({ delimiter: 'auto' }).fromFile(
      path.resolve(__dirname, '../../data/reservations.csv'),
    );

    let reservations = [];
    reservations = reservationData.filter(
      (e) => e.amenity_id == amenityId && e.date == timestamp,
    );

    if (!reservations || reservations.length === 0) {
      return [];
    }

    return this.transformReservations(reservations, amenity);
  }

  protected transformReservations(reservations, amenity) {
    reservations.forEach((e) => {
      e.start_time = Number(e.start_time);
      e.end_time = Number(e.end_time);
    });

    reservations.sort((e1, e2) => {
      if (e1.start_time < e2.start_time) {
        return -1;
      }
      if (e1.start_time > e2.start_time) {
        return 1;
      }
      return 0;
    });

    const newReservations = [];

    for (const reservation of reservations) {
      newReservations.push({
        reservation_id: reservation.id,
        user_id: reservation.user_id,
        start_time: reservation.start_time / 60 + ':00',
        duration_in_minutes: reservation.end_time - reservation.start_time,
        name_of_the_amenity_object: amenity.name,
      });
    }

    return newReservations;
  }

  async findByUserId(userId: number): Promise<any> {
    const data = await csvtojson({ delimiter: 'auto' }).fromFile(
      path.resolve(__dirname, '../../data/reservations.csv'),
    );
    let userBookings = [];
    userBookings = data.filter((e) => e.user_id == userId);
    if (userBookings.length === 0) {
      throw new NotFoundException();
    }
    console.log(
      userBookings,
      ' ',
      userId,
      ' ',
      dayjs(userBookings[0].date).format('YYYY-MM-DD'),
    );
    return this.groupByDate(userBookings);
  }

  protected groupByDate(userBookings) {
    const groupedUserBookings = {};
    for (const booking of userBookings) {
      const day = dayjs(booking.date).format('YYYY-MM-DD');
      if (groupedUserBookings[day]) {
        groupedUserBookings[day].push(booking);
      } else {
        groupedUserBookings[day] = [booking];
      }
    }

    return groupedUserBookings;
  }
}
