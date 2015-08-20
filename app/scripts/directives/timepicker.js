(function () {
	'use strict';

	angular.module('pszczolkowski.datePicker')
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
				templateUrl: 'templates/datepicker.html',
				replace: true,
				link: function (scope) {
					scope.pickType = 'time';
				},
				controller: 'DateTimePickerCtrl'
			};
		});
})();
