(function () {
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.controller('DateTimePickerCtrl', DateTimePickerCtrl);

	DateTimePickerCtrl.$inject = ['$scope', '$modal', 'datePickerConfig'];

	function DateTimePickerCtrl($scope, $modal, datePickerConfig) {
		$scope.minuteStep = $scope.minuteStep || datePickerConfig.minuteStep;
		$scope.pickDate = pickDate;

		var hourMin = $scope.hourMin ? parseInt($scope.hourMin, 10) : undefined;
		var hourMax = $scope.hourMax ? parseInt($scope.hourMax, 10) : undefined;

		function pickDate() {
			var modalInstance = $modal.open({
				size: 'md',
				templateUrl: 'templates/datepickerCalendar.html',
				controller: 'DatePickerCtrl',
				resolve: {
					pickType: function () {
						return $scope.pickType;
					},
					selectedDay: function () {
						return $scope.ngModel;
					},
					constraints: function () {
						return {
							minuteStep: $scope.minuteStep,
							dateMin: $scope.dateMin,
							dateMax: $scope.dateMax,
							hourMin: hourMin,
							hourMax: hourMax
						};
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
				console.log(error);
			});
		}
	}
})();
