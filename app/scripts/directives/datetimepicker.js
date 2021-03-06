(function () {
	'use strict';

	angular.module('pszczolkowski.dateTimePicker')
		.directive('dateTimePicker', dateTimePicker);

	dateTimePicker.$inject = ['dateTimePicker'];

	function dateTimePicker(dateTimePicker) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@',
				dateMin: '=',
				dateMax: '=',
				hourMin: '@',
				hourMax: '@',
				minuteStep: '=',
				onChange: '&'
			},
			require: 'ngModel',
			templateUrl: 'templates/dateTimePickerInput.html',
			replace: true,
			link: function (scope, element, attributes) {
				scope.pickType = 'datetime';
				scope.constraints = {
					dateFormat: scope.dateFormat || dateTimePicker.dateTimeFormat,
					dateMin: scope.dateMin,
					dateMax: scope.dateMax,
					hourMin: scope.hourMin,
					hourMax: scope.hourMax,
					minuteStep: scope.minuteStep,
					required: attributes.required,
					placeholder: attributes.placeholder,
					showWeekNumbers: (attributes.showWeekNumbers !== undefined ? true : dateTimePicker.showWeekNumbers)
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
