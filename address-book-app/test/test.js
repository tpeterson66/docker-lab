  
var expect  = require('chai').expect;
var request = require('request');

it('Main page status', function(done) {
  request('http://localhost:3000' , function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
  });
});

it('About page content', function(done) {
  request('http://localhost:3000/about' , function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
  });
});