import {TaskService as _TaskService_} from "../services.impl";
import {ITaskService, ILocalStorage} from "../services";
import {Task} from "../models";

describe("TaskService", () => {
    // Define service to be tested
    var TaskService: ITaskService;

    // Define dependencies of the service to be tested
    var $timeout: ng.ITimeoutService;
    var LocalStorage: ILocalStorage;

    // Mock AngularJS dependencies
    beforeEach(() => {
        angular.mock.module("app");
        angular.mock.inject((
            _$rootScope_: ng.IRootScopeService,
            _$timeout_: ng.ITimeoutService,
            _LocalStorage_: ILocalStorage
        ) => {
            // Assign dependencies
            $timeout = _$timeout_;
            LocalStorage = _LocalStorage_;
        });

        // Initialize service to be tested
        TaskService = new _TaskService_($timeout, LocalStorage);
    });

    // Mock window.localStorage
    beforeEach(() => {
        // Initial window.localStorage content
        var store: { [key: string]: string } = {
        };

        spyOn(window.localStorage, "getItem").and.callFake((key: string) => {
            return store[key];
        });

        spyOn(localStorage, "setItem").and.callFake(function (key: string, value: string) {
            store[key] = value + "";
        });

        spyOn(localStorage, "clear").and.callFake(function (key: string, value: string) {
            store = {};
        });
    });

    describe("TaskService", () => {
        it("should be defined", () => {
            // Expect TaskService to be defined
            expect(TaskService).toBeDefined();
        });
    });

    describe("TaskService#getTasks", () => {
        it("should return a promise that would resolve to Task[]", () => {
            // Create initial contents            
            let aTask: Task = new Task();
            let anotherTask: Task = new Task();
            anotherTask.title = "Title";
            anotherTask.description = "Description";

            var initialTasks: Task[] = [];
            initialTasks.push(aTask);
            initialTasks.push(anotherTask);

            // Put tasks into window.localStorage
            window.localStorage.setItem("tasks", angular.toJson(initialTasks));

            // Define variable to hold tasks
            var tasks: Task[];

            // Execute TaskService#getTasks
            TaskService.getTasks()
                .then((data) => {
                    tasks = data;
                });

            // Trigger a $timeout#flush;
            $timeout.flush();

            // Expect tasks to be defined and all retrieved tasks contains all the tasks from the local storage 
            expect(tasks).toBeDefined();
            tasks.forEach((task, index) => {
                expect(initialTasks).toContain(task);
            });
        });

        it("should return a promise that would resolve to an empty array if no key was found", () => {
            // Define variable to hold tasks
            var tasks: Task[];

            // Execute TaskService#getTasks
            TaskService.getTasks()
                .then((data) => {
                    tasks = data;
                });

            // Trigger a $timeout#flush;
            $timeout.flush();

            // Expect tasks to be defined and equal to empty array
            expect(tasks).toBeDefined();
            expect(tasks).toEqual([]);
        });
    });

    describe("TaskService#putTasks", () => {
        it("should return a promise that would resolve when input task was put to the storage", () => {
            // Create tasks to be put on storage
            let aTask: Task = new Task();
            let anotherTask: Task = new Task();
            anotherTask.title = "Title";
            anotherTask.description = "Description";

            var tasks: Task[] = [];
            tasks.push(aTask);
            tasks.push(anotherTask);

            // Execute TaskService#putTasks
            TaskService.putTasks(tasks);

            // Trigger a $timeout#flush;
            $timeout.flush();

            // Expect tasks to be equal to the tasks in the local storage
            expect(angular.toJson(tasks)).toEqual(window.localStorage.getItem("tasks"));
        });
    });

    describe("TaskService#addTask", () => {
        var tasks: Task[];

        // Prepare tasks every test instance
        beforeEach(() => {
            // Create tasks instance 
            let aTask: Task = new Task();
            aTask.id = 0;
            aTask.title = "A Title"
            aTask.description = "A Description";
            let anotherTask: Task = new Task();
            anotherTask.id = 1;
            anotherTask.title = "Another Title";
            anotherTask.description = "Another Description";

            tasks = [];
            tasks.push(aTask);
            tasks.push(anotherTask);
        });

        it("should assign a unique id to the input taskToAdd and add it to the input tasks array if taskToAdd.id is null/undefined", () => {
            // Create tasks to add
            let taskToAddWithUndefinedId: Task = new Task();
            taskToAddWithUndefinedId.id = null

            let taskToAddWithNullId: Task = new Task();
            taskToAddWithUndefinedId.id = null

            // Add the created tasks
            TaskService.addTask(tasks, taskToAddWithUndefinedId);
            TaskService.addTask(tasks, taskToAddWithNullId);

            // Expect tasks to contain taskToAddWithNullId and taskToAddWithUndefinedId
            expect(tasks).toContain(taskToAddWithUndefinedId);
            expect(tasks).toContain(taskToAddWithNullId);

            // Expect tasks added to have an id defined
            expect(taskToAddWithUndefinedId).toBeDefined();
            expect(taskToAddWithNullId.id).toBeDefined();

            // Expect id of tasks added to be unique
            let taskToAddWithUndefinedIdMatches: number = 0;
            let taskToAddWithNullIdMatches: number = 0;

            tasks.forEach((task) => {
                if (taskToAddWithUndefinedId.id === task.id) {
                    taskToAddWithUndefinedIdMatches++;
                }

                if (taskToAddWithNullId.id === task.id) {
                    taskToAddWithNullIdMatches++;
                }
            });

            expect(taskToAddWithUndefinedIdMatches).toBeLessThan(2);
            expect(taskToAddWithNullIdMatches).toBeLessThan(2);
        });

        it("should add the input taskToAdd to the input tasks array if no element in input tasks has the same id with taskToAdd", () => {
            // Create task to add
            let taskToAdd: Task = new Task();
            taskToAdd.id = 2;

            // Add the created task
            TaskService.addTask(tasks, taskToAdd);

            // Expect tasks to contain the added tasks
            expect(tasks).toContain(taskToAdd);

            // Expect id of task added to be unique
            let taskToAddIdMatches: number = 0;

            tasks.forEach((task) => {
                if (taskToAdd.id === task.id) {
                    taskToAddIdMatches++;
                }
            });

            expect(taskToAddIdMatches).toBeLessThan(2);
        });

        it("should not add the input taskToAdd to the input tasks array if any element in input tasks has a matching id with taskToAdd", () => {
            // Create task to add
            let taskToAdd: Task = new Task();
            taskToAdd.id = 1;

            // Add the created task
            TaskService.addTask(tasks, taskToAdd);

            // Expect tasks to contain the added tasks
            expect(tasks).not.toContain(taskToAdd);
        });

        it("should return true if input taskToAdd was added to input tasks", () => {
            // Create task to add
            let taskToAdd: Task = new Task();
            taskToAdd.id = 2;
            let anotherTaskToAdd: Task = new Task();
            anotherTaskToAdd.id = null;

            // Expect function to return true
            expect(TaskService.addTask(tasks, taskToAdd)).toEqual(true);
            expect(TaskService.addTask(tasks, anotherTaskToAdd)).toEqual(true);
        });

        it("should return false if input taskToAdd was not added to input tasks", () => {
            // Create task to add
            let taskToAdd: Task = new Task();
            taskToAdd.id = 1;

            // Expect function to return true
            expect(TaskService.addTask(tasks, taskToAdd)).toEqual(false);
        });
    });

    describe("TaskService#removeTask", () => {
        var tasks: Task[];

        // Prepare tasks every test instance
        beforeEach(() => {
            // Create tasks instance 
            let aTask: Task = new Task();
            aTask.id = 0;
            aTask.title = "A Title"
            aTask.description = "A Description";
            let anotherTask: Task = new Task();
            anotherTask.id = 1;
            anotherTask.title = "Another Title";
            anotherTask.description = "Another Description";

            tasks = [];
            tasks.push(aTask);
            tasks.push(anotherTask);
        });

        it("should remove the element from the input tasks that matches to the input taskToRemove", () => {
            // Create task to remove
            let taskToRemove: Task = tasks[0];

            // Remove task
            TaskService.removeTask(tasks, taskToRemove);

            // Expect tasks to not contain an element that matches to the input taskToRemove
            tasks.forEach((task) => {
                expect(task).not.toBe(taskToRemove);
            })
        });

        it("should return true if the element from the input tasksthat matches to the input taskToRemove was removed", () => {
            // Create task to remove
            let taskToRemove: Task = tasks[0];

            // Expect function to return true
            expect(TaskService.removeTask(tasks, taskToRemove)).toEqual(true);
        });

        it("should return false if the no match was found and delete was not performed", () => {
            // Create task without an id match
            let taskToRemove: Task = new Task();
            taskToRemove.id = 2;

            // Expect function to return false
            expect(TaskService.removeTask(tasks, taskToRemove)).toEqual(false);
        });
    });
});