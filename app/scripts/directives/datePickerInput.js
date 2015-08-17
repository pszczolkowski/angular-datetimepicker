(function(){
	'use strict';

	var DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

	angular
		.module('pszczolkowski.datePicker')
		.directive('datePickerInput', datePickerInput);

	datePickerInput.$inject = ['$dateParser', 'dateFilter'];

	function datePickerInput($dateParser, dateFilter) {
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
						date = $dateParser(dateString, DEFAULT_DATE_FORMAT);
					}

					return date === undefined ? dateString : date;
				});

				ngModelController.$formatters.push(function(date) {
					if (scope.dateFormat) {
						return dateFilter(date, scope.dateFormat);
					} else {
						return dateFilter(date, DEFAULT_DATE_FORMAT);
					}
				});
			}
		};
	}

})();
