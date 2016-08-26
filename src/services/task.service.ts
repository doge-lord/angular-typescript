import {Task} from "../models";

export interface ITaskService {

    getTasks(): ng.IPromise<Task[]>;

    putTasks(tasks: Task[]): ng.IPromise<any>;

    addTask(tasks: Task[], taskToAdd: Task): boolean;

    removeTask(tasks: Task[], taskToRemove: Task): boolean;
}