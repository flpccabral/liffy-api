const production = true;

var apiUrl;

production
? apiUrl = 'http://47.76.226.88'
: apiUrl = 'http://root.localhost:3000';

const defaultTitle = document.title;

angular
	.module('liffyAdmin', [
		'ngRoute',
		'ngMaterial',
		'md.data.table',
		'ngMessages',
		'ui.utils.masks'
	])
	.run(['$rootScope', runBlock])
	.directive('nav', nav)
	.factory('driversAPI', ['$http', driversAPI])
	.factory('usersAPI', ['$http', usersAPI])
	.factory('adminAPI', ['$http', adminAPI])
	.factory('bugsAPI', ['$http', bugsAPI])
	.factory('promotionalCodesAPI', ['$http', promotionalCodesAPI])
	.config(['$routeProvider', routeConfig])
	.config(['$mdThemingProvider', mdThemingConfig])
	.controller('signCtrl', ['$rootScope', '$mdToast', 'adminAPI', '$location', signCtrl])
	.controller('navCtrl', ['$mdSidenav', '$location', '$rootScope', '$route', navCtrl])
	.controller('driversCtrl', ['driversAPI', '$mdDialog', '$rootScope', '$mdToast', driversCtrl])
	.controller('usersCtrl', ['usersAPI', '$mdDialog', '$rootScope', '$mdToast', usersCtrl])
	.controller('bugsCtrl', ['bugsAPI', '$mdDialog', '$rootScope', '$mdToast', bugsCtrl])
	.controller('promotionalCodesCtrl', ['promotionalCodesAPI', '$mdDialog', '$rootScope', '$mdToast', promotionalCodesCtrl])
	.controller('settingsCtrl', ['$rootScope', '$mdToast', settingsCtrl])
	.controller('addPromotionalCodeCtrl', ['promotionalCodesAPI', '$location', '$mdToast', addPromotionalCodeCtrl])
	.controller('editDriverCtrl', ['driversAPI', '$routeParams', '$location', '$mdToast', editDriverCtrl])
	.controller('editUserCtrl', ['usersAPI', '$routeParams', '$location', '$mdToast', editUserCtrl]);