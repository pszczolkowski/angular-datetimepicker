'use strict';

describe('Directive: dtpCalendar', function () {

  // load the directive's module
  beforeEach(module('angularDatePickerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dtp-calendar></dtp-calendar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dtpCalendar directive');
  }));
});
