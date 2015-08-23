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
				scope.dateFormat = scope.dateFormat || dateTimePickerConfig.dateTimeFormat;
				scope.required = attributes.required;
				scope.showWeekNumbers = (attributes.showWeekNumbers !== undefined);
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();
