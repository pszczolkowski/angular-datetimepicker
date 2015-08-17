'use strict';

describe('Controller: MainctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('angularDatePickerApp'));

  var MainctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainctrlCtrl = $controller('MainctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(MainctrlCtrl.awesomeThings.length).toBe(3);
  });
});
