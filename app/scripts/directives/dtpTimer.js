(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('dtpTimer', dtpTimer);

	dtpTimer.$inject = ['dateTimePicker', 'dtpUtils'];

	function dtpTimer(dateTimePicker, utils) {
		return {
			templateUrl: function(){
				return dateTimePicker.timerTemplate;
			},
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
				hourMin: scope.hourMin ? parseInt(scope.hourMin, 10) : undefined,
				hourMax: scope.hourMax ? parseInt(scope.hourMax, 10) : undefined,
				minuteStep: scope.minuteStep ? parseInt(scope.minuteStep, 10) : dateTimePicker.minuteStep
			};
			scope.ngModel = scope.ngModel || new Date();
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
			scope.setHour = setHour;
			scope.setMinute = setMinute;

			if (scope.constraints.hourMin && scope.constraints.hourMax && scope.constraints.hourMin > scope.constraints.hourMax) {
				throw 'Minimum hour constraint can\'t be grater than maximum hour constraint';
			}

			roundTimeToFulfillConstraints();
			generateHours();
			generateMinutes();


			function roundTimeToFulfillConstraints() {
				var date = scope.ngModel || new Date();
				var hour = date.getHours();

				if (scope.constraints.hourMin !== undefined && hour < scope.constraints.hourMin) {
					scope.ngModel.setHours(scope.constraints.hourMin);
					scope.ngModel.setMinutes(0);
				} else if (scope.constraints.hourMax !== undefined && hour > scope.constraints.hourMax) {
					scope.ngModel.setHours(scope.constraints.hourMax);
					scope.ngModel.setMinutes(0);
				} else {
					roundTimeToMinuteStep();
				}

				synchronizeFieldsWithModel();
			}

			function roundTimeToMinuteStep() {
				scope.ngModel = utils.roundTimeToMinuteStep(scope.ngModel, scope.constraints.minuteStep);
			}

			function synchronizeFieldsWithModel() {
				scope.selectedTime.hour = scope.ngModel.getHours();
				scope.selectedTime.minute = scope.ngModel.getMinutes();
			}

			function generateHours() {
				var hourMax = scope.constraints.hourMax === undefined ? 23 : scope.constraints.hourMax;
				var hourMin = scope.constraints.hourMin === undefined ? 0 : scope.constraints.hourMin;

				for (var i = hourMax; i >= hourMin; i--) {
					scope.hours.push(i);
				}
			}

			function generateMinutes() {
				scope.minutes = [];

				if (scope.constraints.hourMax !== undefined && scope.ngModel.getHours() >= scope.constraints.hourMax) {
					scope.minutes.push(0);
				}else  {
					for (var i = 60 - scope.constraints.minuteStep; i >= 0; i -= scope.constraints.minuteStep) {
						scope.minutes.push(i);
					}
				}
			}

			function addHours(quantity) {
				setHour(scope.ngModel.getHours() + quantity);
			}

			function validateHourConstraints() {
				if (scope.constraints.hourMin !== undefined && scope.ngModel.getHours() < scope.constraints.hourMin) {
					scope.ngModel.setHours(scope.constraints.hourMin);
				} else if (scope.constraints.hourMax !== undefined && scope.ngModel.getHours() >= scope.constraints.hourMax) {
					scope.ngModel.setHours(scope.constraints.hourMax);
					scope.ngModel.setMinutes(0);
				}
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

			function setHour(hour) {
				scope.ngModel.setHours(hour);
				validateHourConstraints();
				synchronizeFieldsWithModel();
				generateMinutes();
			}

			function setMinute(minute) {
				scope.ngModel.setMinutes(minute);
				synchronizeFieldsWithModel();
			}
		}
	}
})();
