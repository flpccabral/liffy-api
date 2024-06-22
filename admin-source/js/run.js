function runBlock ($rootScope) {
	if (window.sessionStorage.getItem('admin')) $rootScope.adminLogged = true;
	if (window.localStorage.getItem('panelTheme')) {
		$rootScope.panelTheme = window.localStorage.getItem('panelTheme');
	} else {
		$rootScope.panelTheme = 'liffy-blue';
	};
};