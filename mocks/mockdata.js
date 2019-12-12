export default class Mockdata {
  constructor() {
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      validateStatus: function(status) {
        return status <= 500;
      },
    };

    this.newBooking = {
      firstname: 'ApiTest',
      lastname: 'Check123',
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: '2010-01-01', // bug takes date of the past
        checkout: '2012-01-01',
      },
      additionalneeds: 'Breakfast',
    };

    this.updateBooking = {
      firstname: 'ApiTest',
      lastname: 'Check123123',
      totalprice: 222.22, // rounds off this value to int
      depositpaid: 1, // gives 400 on giving null , takes 0 as false, >0 as true
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01',
      },
      additionalneeds: 'Dinner', // takes special characters
    };

    this.invalidDateBooking = {
      firstname: 'ApiTest',
      lastname: 'Check123123',
      totalprice: 222.22,
      depositpaid: 1224345,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '20190101',
      },
      additionalneeds: 'Dinner',
    };

    this.partialFields = {
      lastname: 'Check123123123',
      depositpaid: 1224345,
      bookingdates: {
        checkin: '2017-01-01',
        checkout: '2019-01-01',
      },
    };
  }
}
