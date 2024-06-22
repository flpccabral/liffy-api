function routeConfig ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'view/sign.html',
			controller: 'signCtrl',
			controllerAs: 'vm',
			title: 'Entrar',
			resolve: {
				session: ['$location', function ($location) {
					if (window.sessionStorage.getItem('admin')) $location.path('/drivers');
				}],
				title: function () {
					document.title = defaultTitle + ' - Entrar';
				}
			}
		});
	$routeProvider
		.when('/drivers', {
			templateUrl: 'view/drivers.html',
			controller: 'driversCtrl',
			controllerAs: 'vm',
			title: 'Motoristas',
			resolve: {
				session: ['$location', function ($location) {
					if (!window.sessionStorage.getItem('admin')) $location.path('/');
				}],
				title: function () {
					document.title = defaultTitle + ' - Motoristas'
				}
			}
		});
	$routeProvider
		.when('/edit-driver/:id', {
			templateUrl: 'view/edit-driver.html',
			controller: 'editDriverCtrl',
			controllerAs: 'vm',
			title: 'Editar motorista',
			resolve: {
				session: ['$location', function ($location) {
					if (!window.sessionStorage.getItem('admin')) $location.path('/');
				}],
				title: function () {
					document.title = defaultTitle + ' - Editar motorista'
				}
			}
		});
	$routeProvider
		.when('/users', {
			templateUrl: 'view/users.html',
			controller: 'usersCtrl',
			controllerAs: 'vm',
			title: 'Usuários',
			resolve: {
				session: ['$location', function ($location) {
					if (!window.sessionStorage.getItem('admin')) $location.path('/');
				}],
				title: function () {
					document.title = defaultTitle + ' - Usuários'
				}
			}
		});
	$routeProvider
		.when('/edit-user/:id', {
			templateUrl: 'view/edit-user.html',
			controller: 'editUserCtrl',
			controllerAs: 'vm',
			title: 'Editar usuário',
			resolve: {
				session: ['$location', function ($location) {
					if (!window.sessionStorage.getItem('admin')) $location.path('/');
				}],
				title: function () {
					document.title = defaultTitle + ' - Editar usuário'
				}
			}
		});
	$routeProvider
		.when('/bugs', {
			templateUrl: 'view/bugs.html',
			controller: 'bugsCtrl',
			controllerAs: 'vm',
			title: 'Bugs',
			resolve: {
				session: ['$location', function ($location) {
					if (!window.sessionStorage.getItem('admin')) $location.path('/');
				}],
				title: function () {
					document.title = defaultTitle + ' - Bugs';
				}
			}
		});
	$routeProvider
		.when('/settings', {
			templateUrl: 'view/settings.html',
			controller: 'settingsCtrl',
			controllerAs: 'vm',
			title: 'Configurações',
			resolve: {
				session: ['$location', function ($location) {
					if (!window.sessionStorage.getItem('admin')) $location.path('/');
				}],
				title: function () {
					document.title = defaultTitle + ' - Configurações';
				}
			}
		});
	$routeProvider
		.when('/promotional-codes', {
			templateUrl: 'view/promotional-codes.html',
			controller: 'promotionalCodesCtrl',
			controllerAs: 'vm',
			title: 'Códigos promocionais',
			resolve: {
				session: ['$location', function ($location) {
					if (!window.sessionStorage.getItem('admin')) $location.path('/');
				}],
				title: function () {
					document.title = defaultTitle + ' - Códigos promocionais';
				}
			}
		});
	$routeProvider
		.when('/add-promotional-code', {
			templateUrl: 'view/add-promotional-code.html',
			controller: 'addPromotionalCodeCtrl',
			controllerAs: 'vm',
			title: 'Adicionar código promocional',
			resolve: {
				session: ['$location', function ($location) {
					if (!window.sessionStorage.getItem('admin')) $location.path('/');
				}],
				title: function () {
					document.title = defaultTitle + ' - Adicionar código promocional';
				}
			}
		});
};

function mdThemingConfig ($mdThemingProvider) {
	$mdThemingProvider
		.theme('liffy-blue')
			.primaryPalette('blue')
			.accentPalette('blue')
	$mdThemingProvider
		.theme('liffy-pink')
			.primaryPalette('pink')
			.accentPalette('pink');
	$mdThemingProvider
		.theme('liffy-green')
			.primaryPalette('green')
			.accentPalette('green');
	$mdThemingProvider
		.theme('liffy-orange')
			.primaryPalette('orange')
			.accentPalette('orange');
	$mdThemingProvider
		.theme('liffy-red')
			.primaryPalette('red')
			.accentPalette('red');
};