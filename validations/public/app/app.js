angular.module('fitApp',['appRoutes','userControllers','userServices',,'ngAnimate','mainController','authServices'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});

