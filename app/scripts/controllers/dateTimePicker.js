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
				console.log(error);
			});
		}
	}
})();
