(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('datePicker', datePicker);

	datePicker.$inject = ['dateTimePickerConfig'];

	function datePicker(dateTimePickerConfig) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@',
				dateMin: '=',
				dateMax: '='
			},
			require: 'ngModel',
			templateUrl: 'templates/dateTimePickerInput.html',
			replace: true,
			link: function (scope, element, attributes) {
				scope.pickType = 'date';
				scope.constraints = {
					dateFormat: scope.dateFormat || dateTimePickerConfig.dateFormat,
					dateMin: scope.dateMin,
					dateMax: scope.dateMax,
					required: attributes.required,
					showWeekNumbers: attributes.showWeekNumbers !== undefined
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
