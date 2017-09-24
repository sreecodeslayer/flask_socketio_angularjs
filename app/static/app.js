var tApp = angular.module('ticktock', ['btford.socket-io','ngRoute'],function($interpolateProvider){
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});

tApp.factory('tAppSocket', function (socketFactory) {
  return socketFactory({
  	ioSocket: io.connect('/test')
  });
});

tApp.controller('TimeController',['$scope','$route','tAppSocket',function($scope,$route,tAppSocket){
	tAppSocket.on('time', function(data){
		$scope.time = data.time.split('.')[0];
	});
}]);


tApp.controller('UUIDController',['$scope','$route','tAppSocket',function($scope,$route,tAppSocket){
	tAppSocket.emit('uuid').on('uuid', function(data){
		$scope.uuid = data.uuid;
	});
}]);


tApp.controller('HexController',['$scope','$route','tAppSocket',function($scope,$route,tAppSocket){
	tAppSocket.emit('hex').on('hex', function(data){
		$scope.hex = data.hex;
	});
}]);



tApp.config(function($routeProvider){
	$routeProvider.when('/', {
		controller: 'TimeController',
		templateUrl: '../static/pages/time.html'
	}).when('/uuid', {
		controller: 'UUIDController',
		templateUrl: '../static/pages/uuid.html'
	}).when('/hex', {
		controller: 'HexController',
		templateUrl: '../static/pages/hex.html'
	})
})