(function () {
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.controller('DemoCtrl', DemoCtrl);

	DemoCtrl.$inject = ['$scope'];

	function DemoCtrl($scope) {
		$scope.date = new Date();
		$scope.dateMin = new Date(2015, 7, 10);
		$scope.dateMax = new Date(2015, 8, 3);
	}
})();

