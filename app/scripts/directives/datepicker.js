(function () {
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.directive('datePicker', datePicker);

	datePicker.$inject = ['$modal', 'datePickerConfig'];

	function datePicker($modal, datePickerConfig) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@',
				dateMin: '=',
				dateMax: '='
			},
			require: 'ngModel',
			templateUrl: 'templates/datepicker.html',
			replace: true,
			link: function (scope) {
				scope.pickType = 'date';
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
