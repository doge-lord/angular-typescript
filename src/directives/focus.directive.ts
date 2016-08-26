class Focus implements ng.IDirective {

    public restrict = "A";

    public replace = false;

    public scope = {
        trigger: "@focus"
    };

    constructor(
        private $timeout: ng.ITimeoutService
    ) {
    }

    public link = (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any) => {
        scope.$watch("trigger", () => {
            this.$timeout(() => {
                element[0].focus();
            });
        });
    };

    static factory(): ng.IDirectiveFactory {
        const directive = ($timeout: ng.ITimeoutService) => new Focus($timeout);

        directive.$inject = [
            "$timeout"
        ];

        return directive;
    }

}

export var FocusDirective = Focus.factory();