(function(){
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.directive('datePicker', datePicker);

	datePicker.$inject = ['$modal', 'dateFilter'];

	function datePicker($modal, dateFilter) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@'
			},
			require: 'ngModel',
			templateUrl: 'templates/datepicker.html',
			replace: true,
			link: function(scope, elem, attr, ngModelController) {

			},
			controller: ['$scope', controller]
		};


		function controller($scope) {
			$scope.pickDate = pickDate;


			function pickDate() {
				var modalInstance = $modal.open({
					size: 'md',
					templateUrl: 'templates/datepickerCalendar.html',
					controller: 'DatePickerCtrl',
					resolve: {
						selectedDay: function() {
							return $scope.ngModel;
						}
					}
				});

				modalInstance.result.then(function(date) {
					if (date !== undefined) {
						if (date === null) {
							$scope.ngModel = undefined;
						} else {
							$scope.ngModel = date;
						}
					}
				}, function(error) {
					// tODO
				});
			}
		}
	}
})();
