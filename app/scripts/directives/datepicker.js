(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('datePicker', datePicker);

	datePicker.$inject = ['dateTimePicker'];

	function datePicker(dateTimePicker) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@',
				dateMin: '=',
				dateMax: '=',
				onChange: '&'
			},
			require: 'ngModel',
			templateUrl: 'templates/dateTimePickerInput.html',
			replace: true,
			link: function (scope, element, attributes) {
				scope.pickType = 'date';
				scope.constraints = {
					dateFormat: scope.dateFormat || dateTimePicker.dateFormat,
					dateMin: scope.dateMin,
					dateMax: scope.dateMax,
					required: attributes.required,
					placeholder: attributes.placeholder,
					showWeekNumbers: (attributes.showWeekNumbers !== undefined ? true : dateTimePicker.showWeekNumbers)
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
