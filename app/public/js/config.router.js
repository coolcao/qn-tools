'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/app/form');
                $stateProvider
                    .state('auth', {
                        url: '/auth',
                        templateUrl: 'tpl/auth.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('toaster').then(function () {
                                        return $ocLazyLoad.load(['js/controllers/auth.controller.js']);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'tpl/app.html'
                    })
                    .state('app.form', {
                        url: '/form',
                        templateUrl: 'tpl/app.form.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['angularFileUpload','toaster']).then(function () {
                                        return $ocLazyLoad.load(['js/controllers/file.upload.controller.js']);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.history',{
                        url:'/history',
                        templateUrl:'tpl/app.history.html',
                        resolve:{
                            deps:['$ocLazyLoad',function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['toaster']).then(function () {
                                    return $ocLazyLoad.load(['js/controllers/file.history.controller.js']);
                                });
                            }]
                        }
                    })
                    .state('app.about',{
                        url:'/about',
                        templateUrl:'tpl/app.about.html'
                    })
            }
        ]
    );