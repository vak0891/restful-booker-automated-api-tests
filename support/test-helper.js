import Globals from '../support/globals';
import axios from 'axios';

const globals = new Globals();
const { expect, baseUrl } = globals;

export default class Helpers {
  constructor() {
    // Get token required for authentication and allowing requests to go through
    this.get_token = async function get_token() {
      const res = await axios.post(
        `${baseUrl}/auth`,
        {
          username: 'admin',
          password: 'password123',
        },
        { 'Content-Type': 'application/json' },
      );
      await expect(res.status).to.be.equal(200);
      return res.data.token;
    };

    // Get the booking ID for a specific user
    this.get_booking_id = async function get_booking(name) {
      const res = await axios.get(`${baseUrl}/booking?firstname=${name}`);
      return res.data[0].bookingid;
    };

    // Get auth token and create options list
    this.get_options = async function get_options() {
      const token = await this.get_token();
      const options = {
        headers: {
          Cookie: `token=${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        validateStatus: false,
      };
      return options;
    };
  }
}
