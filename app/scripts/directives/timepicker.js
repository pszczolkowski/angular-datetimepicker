(function () {
	'use strict';

	angular.module('pszczolkowski.dateTimePicker')
		.directive('timePicker', function () {
			return {
				scope: {
					ngModel: '=',
					dateFormat: '@',
					hourMin: '@',
					hourMax: '@',
					minuteStep: '='
				},
				require: 'ngModel',
				templateUrl: 'templates/dateTimePickerInput.html',
				replace: true,
				link: function (scope) {
					scope.pickType = 'time';
				},
				controller: 'DateTimePickerCtrl'
			};
		});
})();
