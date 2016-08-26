import {ITaskService, ILocalStorage} from "../services";
import {Task} from "../models";

export class TaskService implements ITaskService {

    public static $inject = [
        "$timeout",
        "LocalStorage"
    ];

    private static STORAGE_ID: string = "tasks";

    constructor(
        private $timeout: ng.ITimeoutService,
        private LocalStorage: ILocalStorage
    ) {
    }

    public getTasks(): ng.IPromise<Task[]> {
        return this.$timeout<Task[]>(() => {
            let taskJson: string = this.LocalStorage.get(TaskService.STORAGE_ID);

            if (taskJson) {
                let taskLiterals: Object[] = angular.fromJson(taskJson)

                return this.castLiteralsToTasks(taskLiterals);
            } else {
                return [];
            }
        }, 1000);
    }

    public putTasks(tasks: Task[]): ng.IPromise<any> {
        return this.$timeout<any>(() => {
            this.LocalStorage.put(TaskService.STORAGE_ID, angular.toJson(tasks));
        }, 1000);
    }

    public addTask(tasks: Task[], taskToAdd: Task): boolean {
        if (taskToAdd.id || taskToAdd.id === 0) {
            let isTaskFound: boolean = tasks.some((task) => {
                if (taskToAdd.id === task.id) {
                    return true;
                }
            });

            if (isTaskFound) {
                return false;
            } else {
                taskToAdd.dateCreated = new Date();
                tasks.push(taskToAdd);
                return true;
            }
        } else {
            taskToAdd.id = 0;

            tasks.forEach((task) => {
                if (taskToAdd.id <= task.id) {
                    taskToAdd.id = task.id + 1;
                }
            });

            taskToAdd.dateCreated = new Date();
            tasks.push(taskToAdd);
            return true;
        }
    }

    public removeTask(tasks: Task[], taskToRemove: Task): boolean {
        let taskToRemoveIndex: number = tasks.indexOf(taskToRemove);

        if (taskToRemoveIndex >= 0) {
            tasks.splice(taskToRemoveIndex, 1);
            return true;
        } else {
            return false;
        }
    }

    private castLiteralToTask(taskLiteral: Object): Task {
        return angular.extend(new Task(), taskLiteral);
    }

    private castLiteralsToTasks(taskLiterals: Object[]): Task[] {
        var tasks: Task[] = [];

        taskLiterals.forEach(taskLiteral => {
            tasks.push(this.castLiteralToTask(taskLiteral));
        });

        return tasks;
    }
}