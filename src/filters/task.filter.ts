import {TaskStatus, Task} from "../models";

TaskFilter.$inject = [
    "$filter"
];

export function TaskFilter($filter: ng.IFilterService) {
    return (tasks: Task[], status: TaskStatus): Task[] => {
        var filterFilter: ng.IFilterFilter = $filter("filter");

        let predicate: ng.IFilterFilterPredicateFunc<Task> = (value) => {
           if(value.status === status) {
               return true;
           } else {
               return false;
           }
        }

        return filterFilter(tasks, predicate);
    }
}