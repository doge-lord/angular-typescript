import {TaskStatus, Task} from "../../models";

class TaskItem implements ng.IDirective {

    public restrict = "E";

    public replace = true;

    public require = "^^taskGroup";

    public scope = {
        task: "="
    };

    public templateUrl = "task-item.html";

    constructor(
        private $window: ng.IWindowService,
        private $timeout: ng.ITimeoutService
    ) {
    }

    public link = (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any) => {
        scope.editable = {
            title: false,
            description: false
        }

        element.bind("dragstart", (event: any) => {
            if (!event) {
                event = this.$window.event;
            }

            let taskId: number = event.target.attributes["task-id"].value;
            event.dataTransfer.setData("text", taskId);
        });

        scope.removeTask = (task: Task) => {
            controller.removeTask(task);
        }

        scope.editTitle = () => {
            scope.editable.title = true;
        }

        scope.confirmTitle = () => {
            scope.editable.title = false;
        }

        scope.editDescription = () => {
            scope.editable.description = true;
        }

        scope.confirmDescription = () => {
            scope.editable.description = false;
        }

        scope.keypressTitle = (event: any) => {
            // Check if Enter key has been pressed
            if (event.keyCode === 13) {
                // Check if Shift key was not pressed at the same time
                if (!event.shiftKey) {
                    scope.editable.title = false;
                }
            }
        }

        scope.keypressDescription = function (event: any) {
            // Check if Enter key has been pressed
            if (event.keyCode === 13) {
                // Check if Shift key was pressed at the same time
                if (event.shiftKey) {
                    addNewlineToDescription(event.target);
                } else {
                    scope.editable.description = false;
                }
            }
        }

        function addNewlineToDescription(element: any) {
            element.focus();

            if (typeof element.selectionStart == "number" &&
                typeof element.selectionEnd == "number") {
                let newLine: string = "\n";
                let oldDescription: string = element.value;
                let selectionStart: number = element.selectionStart;
                let selectionEnd: number = element.selectionEnd;

                scope.description = oldDescription.slice(0, selectionStart) + newLine + oldDescription.slice(selectionEnd);
                element.selectionEnd = element.selectionStart = selectionStart + newLine.length;

                console.log(angular.toJson(scope.description));
            }
        }
    };

    static factory(): ng.IDirectiveFactory {
        const directive = ($window: ng.IWindowService, $timeout: ng.ITimeoutService) => new TaskItem($window, $timeout);

        directive.$inject = [
            "$window",
            "$timeout"
        ];

        return directive;
    }

}

export var TaskItemDirective = TaskItem.factory();