export var NavBarComponent: ng.IComponentOptions

NavBarComponent = {
    templateUrl: "nav-bar.html",
    controller: "NavBarController",
    controllerAs: "vm",
    bindings: {
        title: "="
    }
}