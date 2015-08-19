(function () {
	'use strict';

	var DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

	angular
		.module('pszczolkowski.datePicker')
		.directive('datePicker', datePicker);

	datePicker.$inject = ['$modal'];

	function datePicker($modal) {
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
			templateUrl: 'templates/datepicker.html',
			replace: true,
			link: function (scope, elem, attr, ngModelController) {

			},
			controller: ['$scope', controller]
		};


		function controller($scope) {
			$scope.minuteStep = $scope.minuteStep || 15;
			$scope.pickDate = pickDate;

			var hourMin = $scope.hourMin ? parseInt($scope.hourMin, 10) : undefined;
			var hourMax = $scope.hourMax ? parseInt($scope.hourMax, 10) : undefined;

			function pickDate() {
				var modalInstance = $modal.open({
					size: 'md',
					templateUrl: 'templates/datepickerCalendar.html',
					controller: 'DatePickerCtrl',
					resolve: {
						selectedDay: function () {
							return $scope.ngModel;
						},
						minuteStep: function () {
							return $scope.minuteStep;
						},
						dateMin: function () {
							return $scope.dateMin;
						},
						dateMax: function () {
							return $scope.dateMax;
						},
						hourMin: function () {
							return hourMin;
						},
						hourMax: function () {
							return hourMax;
						}
					}
				});

				modalInstance.result.then(function (date) {
					if (date !== undefined) {
						if (date === null) {
							$scope.ngModel = undefined;
						} else {
							$scope.ngModel = date;
						}
					}
				}, function (error) {
					// TODO
				});
			}
		}

		function isDate(object) {
			return Object.prototype.toString.call(object) === '[object Date]';
		}
	}
})();
