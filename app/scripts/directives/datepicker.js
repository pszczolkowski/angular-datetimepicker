(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('datePicker', datePicker);

	datePicker.$inject = ['$modal', 'dateTimePickerConfig'];

	function datePicker($modal, dateTimePickerConfig) {
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
				scope.required = attributes.required;
				scope.showWeekNumbers = (attributes.showWeekNumbers !== undefined);
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
