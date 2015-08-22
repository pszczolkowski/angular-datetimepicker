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
				link: function (scope) {
					scope.pickType = 'datetime';
				},
				controller: 'DateTimePickerCtrl'
			};
		});
})();
