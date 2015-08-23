(function () {
	'use strict';

	angular.module('pszczolkowski.dateTimePicker')
		.directive('timePicker', timePicker);

	timePicker.$inject = ['dateTimePickerConfig'];

	function timePicker(dateTimePickerConfig) {
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
			link: function (scope, element, attributes) {
				scope.pickType = 'time';
				scope.dateFormat = scope.dateFormat || dateTimePickerConfig.timeFormat;
				scope.required = attributes.required;
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
