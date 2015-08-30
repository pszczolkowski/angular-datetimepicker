(function(){
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('datePickerInput', datePickerInput);

	datePickerInput.$inject = ['$dateParser', 'dateFilter', 'dateTimePicker', 'dtpUtils'];

	function datePickerInput($dateParser, dateFilter, dateTimePicker, utils) {
		return {
			scope: {
				inputConstraints: '=',
				pickType: '=datePickerInput'
			},
			require: 'ngModel',
			link: function(scope, elem, attributes, ngModelController) {
				if (ngModelController) {
					ngModelController.$parsers.push(function(dateString) {
						if (dateString === '') {
							if (scope.inputConstraints.required) {
								markDateAsInvalidBecauseOf('required');
							} else {
								markDateAsValid();
							}

							return null;
						}

						var date = $dateParser(dateString, scope.inputConstraints.dateFormat);

						if (date !== undefined) {
							if (thereIsDatepicker()) {
								if (dateDoesNotFulfillConstraints(date)) {
									markDateAsInvalidBecauseOf('date');
									return dateString;
								}
							}

							if (thereIsTimepicker()) {
								if (minutesDoNotMatchMinuteStep(date)) {
									markDateAsInvalidBecauseOf('date');
									return dateString;
								}
								if (hourDoesNotFulfillConstraints(date)) {
									markDateAsInvalidBecauseOf('date');
									return dateString;
								}
							}

							markDateAsValid();
							return date;
						} else {
							markDateAsInvalidBecauseOf('format');
							return dateString;
						}
					});

					ngModelController.$formatters.push(function(date) {
						markDateAsValid();
						return dateFilter(date, scope.inputConstraints.dateFormat);
					});
				}


				function markDateAsValid() {
					ngModelController.$setValidity('format', true);
					ngModelController.$setValidity('date', true);
					ngModelController.$setValidity('required', true);
				}

				function markDateAsInvalidBecauseOf(reason) {
					ngModelController.$setValidity(reason, false);
				}

				function thereIsDatepicker() {
					return scope.pickType === 'datetime' ||
						scope.pickType === 'date';
				}

				function thereIsTimepicker() {
					return scope.pickType === 'datetime' ||
						scope.pickType === 'time';
				}

				function dateDoesNotFulfillConstraints(date) {
					var dateMin = scope.inputConstraints.dateMin || dateTimePicker.minimumDate;
					var dateMax = scope.inputConstraints.dateMax || dateTimePicker.maximumDate;
					dateMax = utils.endOfDay(dateMax);

					return date < dateMin || date > dateMax;
				}

				function minutesDoNotMatchMinuteStep(date) {
					var minuteStep = scope.inputConstraints.minuteStep || dateTimePicker.minuteStep;
					return date.getMinutes() % minuteStep !== 0;
				}

				function hourDoesNotFulfillConstraints(date) {
					var hourMin = scope.inputConstraints.hourMin;
					if (hourMin === undefined) {
						hourMin = dateTimePicker.minimumHour;
					}
					var hourMax = scope.inputConstraints.hourMax;
					if (hourMax === undefined) {
						hourMax = dateTimePicker.maximumHour;
					}

					return date.getHours() < hourMin || date.getHours() > hourMax;
				}
			}
		};
	}

})();
