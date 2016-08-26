import {Config} from "./app.config";
import * as Components from "./components";
import * as Directives from "./directives";
import * as Filters from "./filters";
import * as Services from "./services.impl";

let moduleDependencies: string[] = [
    "ngResource",
    "ngRoute"
];

let app: ng.IModule = angular.module("app", moduleDependencies)
    // Services
    .service("LocalStorage", Services.LocalStorage)
    .service("TaskService", Services.TaskService)

    // Filters
    .filter("taskFilter", Filters.TaskFilter)

    // Directives
    .directive("focus", Directives.FocusDirective)

    // Components
    .component("navBar", Components.NavBarComponent)

    .controller("MainController", Components.MainController)
    .controller("NavBarController", Components.NavBarController)
    .controller("TaskListController", Components.TaskListController)

    .directive("taskGroup", Components.TaskGroupDirective)
    .directive("taskItem", Components.TaskItemDirective)

    // AngularJS Config
    .config(Config);
