(function(){
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.directive('datePickerInput', datePickerInput);

	datePickerInput.$inject = ['$dateParser', 'dateFilter', 'datePickerConfig'];

	function datePickerInput($dateParser, dateFilter, datePickerConfig) {
		return {
			scope: {
				dateFormat: '@',
				datePickerInput: '='
			},
			require: 'ngModel',
			link: function(scope, elem, attr, ngModelController) {
				var format = scope.dateFormat;

				if (ngModelController) {
					ngModelController.$parsers.push(function(dateString) {
						selectFormat();

						var date = $dateParser(dateString, format);
						return date === undefined ? dateString : date;
					});

					ngModelController.$formatters.push(function(date) {
						selectFormat();
						return dateFilter(date, format);
					});
				}


				function selectFormat () {
					if (!format) {
						switch (scope.datePickerInput) {
							case 'date':
								format = datePickerConfig.dateFormat;
								break;
							case 'datetime':
								format = datePickerConfig.dateTimeFormat;
								break;
							case 'time':
								format = datePickerConfig.timeFormat;
								break;
						}
					}
				}
			}
		};
	}

})();
