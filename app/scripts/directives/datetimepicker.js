(function () {
	'use strict';

	angular.module('pszczolkowski.dateTimePicker')
		.directive('dateTimePicker', dateTimePicker);

	dateTimePicker.$inject = ['dateTimePickerConfig'];

	function dateTimePicker(dateTimePickerConfig) {
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
				scope.constraints = {
					dateFormat: scope.dateFormat || dateTimePickerConfig.dateTimeFormat,
					dateMin: scope.dateMin,
					dateMax: scope.dateMax,
					hourMin: scope.hourMin,
					hourMax: scope.hourMax,
					minuteStep: scope.minuteStep,
					required: attributes.required,
					showWeekNumbers: (attributes.showWeekNumbers !== undefined ? true : dateTimePickerConfig.showWeekNumbers)
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
