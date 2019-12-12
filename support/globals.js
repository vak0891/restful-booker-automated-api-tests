import chai from 'chai';

export default class Globals {
  constructor() {
    this.expect = chai.expect;
    this.baseUrl = 'https://restful-booker.herokuapp.com';
  }
}
