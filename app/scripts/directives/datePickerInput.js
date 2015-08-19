(function(){
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.directive('datePickerInput', datePickerInput);

	datePickerInput.$inject = ['$dateParser', 'dateFilter', 'datePickerConfig'];

	function datePickerInput($dateParser, dateFilter, datePickerConfig) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@'
			},
			require: 'ngModel',
			link: function(scope, elem, attr, ngModelController) {
				ngModelController.$parsers.push(function(dateString) {
					var date = undefined;

					if (scope.dateFormat) {
						date =  $dateParser(dateString, scope.dateFormat);
					} else {
						date = $dateParser(dateString, datePickerConfig.dateFormat);
					}

					return date === undefined ? dateString : date;
				});

				ngModelController.$formatters.push(function(date) {
					if (scope.dateFormat) {
						return dateFilter(date, scope.dateFormat);
					} else {
						return dateFilter(date, datePickerConfig.dateFormat);
					}
				});
			}
		};
	}

})();
