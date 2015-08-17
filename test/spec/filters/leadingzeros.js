'use strict';

describe('Filter: leadingZeros', function () {

  // load the filter's module
  beforeEach(module('angularDatePickerApp'));

  // initialize a new instance of the filter before each test
  var leadingZeros;
  beforeEach(inject(function ($filter) {
    leadingZeros = $filter('leadingZeros');
  }));

  it('should return the input prefixed with "leadingZeros filter:"', function () {
    var text = 'angularjs';
    expect(leadingZeros(text)).toBe('leadingZeros filter: ' + text);
  });

});
