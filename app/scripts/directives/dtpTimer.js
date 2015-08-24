(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('dtpTimer', dtpTimer);

	dtpTimer.$inject = ['dateTimePickerConfig'];

	function dtpTimer(dateTimePickerConfig) {
		return {
			templateUrl: 'templates/dateTimePickerTimer.html',
			require: 'ngModel',
			scope: {
				ngModel: '=',
				hourMin: '@',
				hourMax: '@',
				minuteStep: '@'
			},
			link: link
		};


		function link(scope) {
			scope.constraints = {
				hourMin: scope.hourMin === undefined ? dateTimePickerConfig.minimumHour : parseInt(scope.hourMin, 10),
				hourMax: scope.hourMax === undefined ? dateTimePickerConfig.maximumHour : parseInt(scope.hourMax, 10),
				minuteStep: scope.minuteStep === undefined ? dateTimePickerConfig.minuteStep : parseInt(scope.minuteStep, 10)
			};
			scope.hours = [];
			scope.minutes = [];
			scope.selectedTime = {
				hour: scope.ngModel.getHours(),
				minute: scope.ngModel.getMinutes()
			};
			scope.minusHour = minusHour;
			scope.plusHour = plusHour;
			scope.minusMinute = minusMinute;
			scope.plusMinute = plusMinute;
			scope.hourChange = hourChange;
			scope.minuteChange = minuteChange;

			if (scope.constraints.hourMin > scope.constraints.hourMax) {
				throw 'Minimum hour constraint can\'t be grater than maximum hour constraint';
			}

			roundTimeToFulfillConstraints();
			generateHours();
			generateMinutes();


			function roundTimeToFulfillConstraints() {
				var date = scope.ngModel || new Date();
				var hour = date.getHours();

				if (hour < scope.constraints.hourMin) {
					scope.ngModel.setHours(scope.constraints.hourMin);
					scope.ngModel.setMinutes(0);
				} else if (hour > scope.constraints.hourMax) {
					scope.ngModel.setHours(scope.constraints.hourMax);
					scope.ngModel.setMinutes(0);
				}

				synchronizeFieldsWithModel();
			}

			function synchronizeFieldsWithModel() {
				scope.selectedTime.hour = scope.ngModel.getHours();
				scope.selectedTime.minute = roundMinute(scope.ngModel, scope.constraints.minuteStep);
			}

			function roundMinute(date, minuteStep) {
				date = date || new Date();
				var minute = date.getMinutes();
				var rounded = minuteStep * Math.round(minute / minuteStep);

				return rounded > 59 ? 0 : rounded;
			}

			function generateHours() {
				for (var i = scope.hourMax; i >= scope.hourMin; i--) {
					scope.hours.push(i);
				}
			}

			function generateMinutes() {
				for (var i = 60 - scope.constraints.minuteStep; i >= 0; i -= scope.constraints.minuteStep) {
					scope.minutes.push(i);
				}
			}

			function addHours(quantity) {
				scope.ngModel.setHours(scope.ngModel.getHours() + quantity);
				validateHourConstraints();
			}

			function validateHourConstraints() {
				if (scope.ngModel.getHours() < scope.constraints.hourMin) {
					scope.ngModel.setHours(scope.constraints.hourMin);
				} else if (scope.ngModel.getHours() > scope.constraints.hourMax) {
					scope.ngModel.setHours(scope.constraints.hourMax);
				}
				synchronizeFieldsWithModel();
			}

			function minusHour() {
				addHours(-1);
			}

			function plusHour() {
				addHours(1);
			}

			function addMinutes(quantity) {
				scope.selectedTime.minute = (scope.selectedTime.minute + quantity + 60) % 60;
			}

			function minusMinute() {
				addMinutes(-scope.constraints.minuteStep);
			}

			function plusMinute() {
				addMinutes(scope.constraints.minuteStep);
			}

			function hourChange() {
				scope.ngModel.setHours(scope.selectedTime.hour);
				synchronizeFieldsWithModel();
			}

			function minuteChange() {
				scope.ngModel.setMinutes(scope.selectedTime.minute);
				synchronizeFieldsWithModel();
			}
		}
	}
})();
