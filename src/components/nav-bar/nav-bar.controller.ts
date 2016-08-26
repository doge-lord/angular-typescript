export class NavBarController {

    public haha: boolean = true;

    public static $inject = [
        "$scope",
        "$location"
    ];

    constructor(
        private $scope: ng.IScope,
        private $location: ng.ILocationService
    ) {
    }

    public isActive(route: string): boolean {
        return this.$location.path() === route;
    }
}