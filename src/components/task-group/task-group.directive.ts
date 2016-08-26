import {TaskStatus, Task} from "../../models";
import {ITaskService} from "../../services";

class TaskGroup implements ng.IDirective {

    public restrict = "E";

    public replace = true;

    public scope = {
        tasks: "=",
        status: "@",
        taskTitle: "@"
    };

    public templateUrl = "task-group.html";

    constructor(
    ) {
        this.controller.$inject = [
            "$scope",
            "$element",
            "TaskService"
        ]
    }

    public controller = function ($scope: any, $element: ng.IAugmentedJQuery, TaskService: ITaskService) {
        var status: any = TaskStatus[$scope.status];

        $scope.filterBy = status;

        $element.on("dragover", (event) => {
            event.stopPropagation();
            event.preventDefault();
        });

        $element.on("drop", (event: any) => {
            event.preventDefault();

            $scope.$apply(() => {
                let taskId: number = parseInt(event.dataTransfer.getData("text"));
                let tasks: Task[] = $scope.tasks;

                for (let i = tasks.length - 1; i >= 0; i--) {
                    if (tasks[i].id === taskId) {
                        tasks[i].status = status;
                        break;
                    }
                }
            });
        });

        $scope.addTask = () => {
            let newTask: Task = new Task();
            newTask.status = status;
            TaskService.addTask($scope.tasks, newTask);
        }

        this.removeTask = function (task: Task) {
            TaskService.removeTask($scope.tasks, task);
        }
    };

    static factory(): ng.IDirectiveFactory {
        const directive = () => new TaskGroup();

        directive.$inject = [
        ];

        return directive;
    }

}

export var TaskGroupDirective = TaskGroup.factory();