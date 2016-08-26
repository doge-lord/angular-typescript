Config.$inject = [
    "$routeProvider"
];

export function Config(
    $routeProvider: angular.route.IRouteProvider
) {
    $routeProvider
        .when("/app", {
            templateUrl: "task-list.html",
            controller: "TaskListController",
            controllerAs: "vm"
        })
        .when("/about", {
            templateUrl: "about.html"
        })
        .otherwise({
            redirectTo: "/app"
        });

}