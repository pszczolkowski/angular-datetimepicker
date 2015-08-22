(function () {
	'use strict';

	angular.module('pszczolkowski.dateTimePicker')
		.directive('dateTimePicker', function () {
			return {
				scope: {
					ngModel: '=',
					dateFormat: '@',
					dateMin: '=',
					dateMax: '=',
					hourMin: '@',
					hourMax: '@',
					minuteStep: '='
				},
				require: 'ngModel',
				templateUrl: 'templates/dateTimePickerInput.html',
				replace: true,
				link: function (scope, element, attributes) {
					scope.pickType = 'datetime';
					scope.required = attributes.required;
					scope.showWeekNumbers = (attributes.showWeekNumbers !== undefined);
				},
				controller: 'DateTimePickerCtrl'
			};
		});
})();
