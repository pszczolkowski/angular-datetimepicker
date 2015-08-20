(function () {
	'use strict';

	angular.module('pszczolkowski.datePicker')
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
				templateUrl: 'templates/datepicker.html',
				replace: true,
				link: function (scope) {
					scope.pickType = 'datetime';
				},
				controller: 'DateTimePickerCtrl'
			};
		});
})();
