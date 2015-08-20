'use strict';

describe('Directive: dateTimePicker', function () {

  // load the directive's module
  beforeEach(module('angularDatePickerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<date-time-picker></date-time-picker>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dateTimePicker directive');
  }));
});
