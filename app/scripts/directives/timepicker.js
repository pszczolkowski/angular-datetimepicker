(function () {
	'use strict';

	angular.module('pszczolkowski.dateTimePicker')
		.directive('timePicker', timePicker);

	timePicker.$inject = ['dateTimePicker'];

	function timePicker(dateTimePicker) {
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
					dateFormat: scope.dateFormat || dateTimePicker.timeFormat,
					hourMin: scope.hourMin,
					hourMax: scope.hourMax,
					minuteStep: scope.minuteStep,
					required: attributes.required,
					placeholder: attributes.placeholder,
					showWeekNumbers: attributes.showWeekNumbers !== undefined
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
