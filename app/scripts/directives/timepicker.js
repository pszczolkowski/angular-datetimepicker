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
				scope.constraints = {
					dateFormat: scope.dateFormat || dateTimePickerConfig.timeFormat,
					hourMin: scope.hourMin,
					hourMax: scope.hourMax,
					minuteStep: scope.minuteStep,
					required: attributes.required,
					showWeekNumbers: attributes.showWeekNumbers !== undefined
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
