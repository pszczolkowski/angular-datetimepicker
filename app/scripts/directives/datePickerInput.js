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
			link: function(scope, elem, attributes, ngModelController) {
				// invoke manually formatters when dateFormat is 
				// properly assigned. They are run for first time
				// when dateFormat is not assigned yet
				attributes.$observe('dateFormat', function (dateFormat) {
					if (ngModelController.$modelValue) {
						ngModelController.$modelValue = new Date(ngModelController.$modelValue.getTime());
					}
				});
				
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
