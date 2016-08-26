import {TaskStatus, Task} from "../../models";
import {ITaskService} from "../../services";

export class TaskListController {

    public tasks: Task[];

    public static $inject = [
        "$scope",
        "$log",
        "TaskService"
    ];

    constructor(
        private $scope: ng.IScope,
        private $log: ng.ILogService,
        private TaskService: ITaskService
    ) {
        this.getTasks();
    }

    public getTasks(): ng.IPromise<any> {
        return this.TaskService.getTasks()
            .then((data) => {
                this.tasks = data;
                this.$log.info("Retrieved tasks from Local Storage.");
            })
            .catch((error) => {
                this.$log.error("Error retrieving tasks. Error" + error);
            });
    }

    public saveTasks(): ng.IPromise<any> {
        return this.TaskService.putTasks(this.tasks)
            .then(() => {
                this.$log.info("Saved tasks to Local Storage.");
            })
            .catch((error) => {
                this.$log.error("Error saving tasks. Error" + error);
            });
    }

    public removeAllTasks(): void {
        if (this.tasks) {
            this.tasks.splice(0, this.tasks.length);
            this.$log.info("Removed all tasks from the screen.");
        }
    }
    
}