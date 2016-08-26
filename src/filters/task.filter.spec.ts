import {TaskFilter as _TaskFilter_} from "../filters";
import {TaskStatus, Task} from "../models";

describe("TaskFilter", () => {
    // Define filter to be tested
    var TaskFilter: (tasks: Task[], status: TaskStatus) => Task[];

    // Define dependencies of the filter to be tested
    var $filter: ng.IFilterService;

    // Define mock input data
    var tasks: Task[];

    // Mock AngularJS dependencies
    beforeEach(() => {
        angular.mock.module("app");
        angular.mock.inject((
            _$filter_: ng.IFilterService
        ) => {
            // Assign dependencies
            $filter = _$filter_;
        });

        // Assign filter to be tested
        TaskFilter = _TaskFilter_($filter);
    });

    // Mock input data
    beforeEach(() => {
        tasks = [];

        let firstTask: Task = new Task();
        firstTask.title = "First";
        firstTask.description = "First Task";
        firstTask.dateCreated = new Date();
        tasks.push(firstTask);

        let secondTask: Task = new Task();
        secondTask.title = "Second";
        secondTask.description = "Second Task";
        secondTask.dateCreated = new Date();
        secondTask.status = TaskStatus.NotStarted;
        tasks.push(secondTask);

        let thirdTask: Task = new Task();
        thirdTask.title = "Third";
        thirdTask.description = "Third Task";
        thirdTask.dateCreated = new Date();
        thirdTask.status = TaskStatus.InProgress;
        tasks.push(thirdTask);

        let fourthTask: Task = new Task();
        fourthTask.title = "Fourth";
        fourthTask.description = "Fourth Task";
        fourthTask.status = TaskStatus.Completed;
        tasks.push(fourthTask);

        let fifthTask: Task = new Task();
        fifthTask.title = "Fifth";
        fifthTask.description = "Fifth Task";
        fifthTask.dateCreated = new Date();
        fifthTask.status = TaskStatus.InProgress;
        tasks.push(fifthTask);
    });

    describe("TaskFilter", () => {
        it("should be defined", () => {
            expect(TaskFilter).toBeDefined();
        });

        it("should return a function that would return all not started tasks if the input status is TaskStatus.NotStarted", () => {
            TaskFilter(tasks, TaskStatus.NotStarted).forEach((task) => {
                // Expect all tasks have NotStarted status
                expect(task.status).toEqual(TaskStatus.NotStarted);
            });
        });

        it("should return a function that would return all in progress tasks if the input status is TaskStatus.InProgress", () => {
            TaskFilter(tasks, TaskStatus.InProgress).forEach((task) => {
                // Expect all tasks have InProgress status
                expect(task.status).toEqual(TaskStatus.InProgress);
            });
        });

        it("should return a function that would return all completed tasks if the input status is TaskStatus.Completed", () => {
            TaskFilter(tasks, TaskStatus.Completed).forEach((task) => {
                // Expect all tasks have Completed status
                expect(task.status).toEqual(TaskStatus.Completed);
            });
        });
    });
});