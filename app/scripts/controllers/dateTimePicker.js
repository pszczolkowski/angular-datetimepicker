(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.controller('DateTimePickerCtrl', DateTimePickerCtrl);

	DateTimePickerCtrl.$inject = ['$scope', '$timeout', '$modal', 'dateTimePickerConfig', 'dtpUtils'];

	function DateTimePickerCtrl($scope, $timeout, $modal, dateTimePickerConfig, utils) {
		$scope.pickDate = pickDate;

		$timeout(function () {
			if ($scope.ngModel) {
				$scope.ngModel = utils.roundTimeToMinuteStep($scope.ngModel, $scope.constraints.minuteStep || dateTimePickerConfig.minuteStep);
			}
		});


		function pickDate() {
			var modalInstance = $modal.open({
				size: 'md',
				templateUrl: dateTimePickerConfig.modalTemplate,
				controller: 'DateTimePickerModalCtrl',
				resolve: {
					pickType: function () {
						return $scope.pickType;
					},
					selectedDate: function () {
						return $scope.ngModel;
					},
					constraints: function () {
						return $scope.constraints;
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
			});
		}
	}
})();
