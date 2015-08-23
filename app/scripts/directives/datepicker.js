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
				scope.dateFormat = scope.dateFormat || dateTimePickerConfig.dateFormat;
				scope.required = attributes.required;
				scope.showWeekNumbers = (attributes.showWeekNumbers !== undefined);
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
