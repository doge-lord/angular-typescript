import {TaskStatus, Task} from "../../models";

export class MainController {

    public static $inject = [
        "$scope"
    ];

    constructor(
        private $scope: ng.IScope
    ) {
        
    }

}