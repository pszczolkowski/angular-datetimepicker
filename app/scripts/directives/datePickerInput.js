(function(){
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('datePickerInput', datePickerInput);

	datePickerInput.$inject = ['$dateParser', 'dateFilter', 'dateTimePickerConfig'];

	function datePickerInput($dateParser, dateFilter, dateTimePickerConfig) {
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
								format = dateTimePickerConfig.dateFormat;
								break;
							case 'datetime':
								format = dateTimePickerConfig.dateTimeFormat;
								break;
							case 'time':
								format = dateTimePickerConfig.timeFormat;
								break;
						}
					}
				}
			}
		};
	}

})();
