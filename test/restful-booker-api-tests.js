import axios from 'axios';
import Helpers from '../support/test-helper';
import Globals from '../support/globals';
import Mockdata from '../mocks/mockdata';

const helpers = new Helpers();
const globals = new Globals();
const mockdata = new Mockdata();

const { expect, baseUrl } = globals;

//Disable SSL certificate verification
//ssprocess.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Restful Booker API Tests', function() {
  describe('Restful Booker API Tests - Positive Flow tests', function() {
    it('Create a new booking', async function() {
      const res = await axios.post(`${baseUrl}/booking`, mockdata.newBooking, mockdata.options);
      expect(res.status).to.be.equal(200);
      expect(res.data.booking.firstname).to.be.equal('ApiTest');
      expect(res.data.booking.lastname).to.be.equal('Check123');
      expect(res.data.booking.totalprice).to.be.equal(111);
      expect(res.data.booking.depositpaid).to.be.equal(true);
      expect(res.data.booking.bookingdates.checkin).to.be.equal('2010-01-01');
      expect(res.data.booking.bookingdates.checkout).to.be.equal('2012-01-01');
      expect(res.data.booking.additionalneeds).to.be.equal('Breakfast');
    });

    it('Update an existing booking', async function() {
      const options = await helpers.get_options();
      const id = await helpers.get_booking_id('ApiTest');
      const res = await axios.put(`${baseUrl}/booking/${id}`, mockdata.updateBooking, options);
      expect(res.status).to.be.equal(200);
      expect(res.data.firstname).to.be.equal('ApiTest');
      expect(res.data.lastname).to.be.equal('Check123123');
      expect(res.data.totalprice).to.be.equal(222); // Bug 222.22 not accepted
      expect(res.data.depositpaid).to.be.equal(true);
      expect(res.data.bookingdates.checkin).to.be.equal('2018-01-01'); // Bug accepting checkins and checkouts in the past
      expect(res.data.bookingdates.checkout).to.be.equal('2019-01-01');
      expect(res.data.additionalneeds).to.be.equal('Dinner');
    });

    it('Update only partial information in an existing booking', async function() {
      const options = await helpers.get_options();
      const id = await helpers.get_booking_id('ApiTest');
      const res = await axios.patch(`${baseUrl}/booking/${id}`, mockdata.partialFields, options);
      expect(res.status).to.be.equal(200);
      expect(res.data.firstname).to.be.equal('ApiTest');
      expect(res.data.lastname).to.be.equal('Check123123123');
      expect(res.data.totalprice).to.be.equal(222);
      expect(res.data.depositpaid).to.be.equal(true);
      expect(res.data.bookingdates.checkin).to.be.equal('2017-01-01');
      expect(res.data.bookingdates.checkout).to.be.equal('2019-01-01');
      expect(res.data.additionalneeds).to.be.equal('Dinner');
    });

    it('Retrieve an existing booking', async function() {
      const id = await helpers.get_booking_id('ApiTest');
      const res = await axios.get(`${baseUrl}/booking/${id}`, mockdata.options);
      expect(res.status).to.be.equal(200);
      expect(res.data.firstname).to.be.equal('ApiTest');
      expect(res.data.lastname).to.be.equal('Check123123123');
      expect(res.data.totalprice).to.be.equal(222); // Bug 222.22 not accepted
      expect(res.data.depositpaid).to.be.equal(true);
      expect(res.data.bookingdates.checkin).to.be.equal('2017-01-01'); // Bug accepting checkins and checkouts in the past
      expect(res.data.bookingdates.checkout).to.be.equal('2019-01-01');
      expect(res.data.additionalneeds).to.be.equal('Dinner');
    });

    it('Delete an existing booking', async function() {
      const options = await helpers.get_options();
      const id = await helpers.get_booking_id('ApiTest');
      if (id) {
        let res = await axios.delete(`${baseUrl}/booking/${id}`, options);
        expect(res.status).to.be.equal(201);
        res = await axios.get(`${baseUrl}/booking/${id}`, {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          validateStatus: false,
        });
        expect(res.status).to.be.equal(404);
      }
    });

    it('Health Check API', async function() {
      const res = await axios.get(`${baseUrl}/ping`, mockdata.options);
      expect(res.status).to.be.equal(201);
      expect(res.data).to.be.equal('Created');
    });

    after('Clean up of the bookings we created during test run', async function() {
      const options = await helpers.get_options();
      const res = await axios.get(`${baseUrl}/booking?firstname=ApiTest`);
      if (res.data.length > 0) {
        res.data.forEach(async element => {
          const res_del = await axios.delete(`${baseUrl}/booking/${element.bookingid}`, options);
          expect(res_del.status).to.be.equal(201);
        });
      }
    });
  });

  describe('Restful Booker API Tests - Negative Flow tests', function() {
    before('Create a booking for use in tests', async function() {
      const res = await axios.post(`${baseUrl}/booking`, mockdata.newBooking, mockdata.options);
      expect(res.status).to.be.equal(200);
    });

    it('Request to be forbidden without auth', async function() {
      const res = await axios.put(`${baseUrl}/booking/1`, mockdata.updateBooking, mockdata.options);
      expect(res.status).to.be.equal(403);
    });

    it('Delete request for an ID that does not exist', async function() {
      const options = await helpers.get_options();
      const res = await axios.delete(`${baseUrl}/booking/11111`, options);
      expect(res.status).to.not.equal(201);
      // instead of giving 400 it is givng 405 method not allowed BUG
    });

    it('Fetch request for an ID that does not exist', async function() {
      const res = await axios.get(`${baseUrl}/booking/abcd1234`, mockdata.options);
      expect(res.status).to.equal(404);
      // instead of giving 400 it is givng 405 method not allowed BUG
    });

    it('Create a booking with missing fields', async function() {
      const res = await axios.post(`${baseUrl}/booking`, mockdata.partialFields, mockdata.options);
      expect(res.status).to.be.equal(500);
      expect(res.data).to.be.equal('Internal Server Error'); // should again be 400!
    });

    it('Invalid date format must be handled', async function() {
      const options = await helpers.get_options();
      const id = await helpers.get_booking_id('ApiTest');
      const res = await axios.put(`${baseUrl}/booking/${id}`, mockdata.invalidDateBooking, options);
      expect(res.status).to.be.equal(200); // Again BUG shouldnt this be 400 with update
      expect(res.data).to.be.equal('Invalid date');
    });
  });

  // Bug 1 :
  //----------------------------//
  // Create booking - give invalid Date, it creates the booking but on trying to retrieve the booking we get Invalid date
  /*
   curl -i https://restful-booker.herokuapp.com/booking?firstname=ApiTest
HTTP/1.1 200 OK
Server: Cowboy
Connection: keep-alive
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 18
Etag: W/"12-8JPL2DdbVGjiowql3DEGGgjaRWY"
Date: Fri, 06 Dec 2019 15:37:52 GMT
Via: 1.1 vegur

[{"bookingid":13}](base) vaishnavis-MacBook-Pro:~ vaishnavi$ curl -i https://restful-booker.herokuapp.com/booking/13
HTTP/1.1 200 OK
Server: Cowboy
Connection: keep-alive
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 12
Etag: W/"c-P0XYzP/nXhDkZpYYmYm1EhvcI1s"
Date: Fri, 06 Dec 2019 15:38:02 GMT
Via: 1.1 vegur

Invalid date(base) */
});
