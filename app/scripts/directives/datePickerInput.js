(function(){
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('datePickerInput', datePickerInput);

	datePickerInput.$inject = ['$dateParser', 'dateFilter', 'dateTimePickerConfig'];

	function datePickerInput($dateParser, dateFilter) {
		return {
			scope: {
				dateFormat: '@',
				datePickerInput: '='
			},
			require: 'ngModel',
			link: function(scope, elem, attr, ngModelController) {
				if (ngModelController) {
					ngModelController.$parsers.push(function(dateString) {
						var date = $dateParser(dateString, scope.dateFormat);
						return date === undefined ? dateString : date;
					});

					ngModelController.$formatters.push(function(date) {
						return dateFilter(date, scope.dateFormat);
					});
				}
			}
		};
	}

})();
