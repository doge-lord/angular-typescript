import {LocalStorage as _LocalStorage_} from "../services.impl";
import {ILocalStorage} from "../services";

describe("LocalStorage", () => {

    // Define service to be tested
    var LocalStorage: ILocalStorage;

    // Mock AngularJS dependencies
    beforeEach(() => {
        angular.mock.module("app");
        angular.mock.inject((
        ) => {

        });

        // Initialize service to be tested
        LocalStorage = new _LocalStorage_();
    });

    // Mock window.localStorage
    beforeEach(() => {
        // Initial window.localStorage content
        var store: { [key: string]: string } = {
            "KEY_1": "VALUE_OF_KEY_1"
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

    describe("LocalStorage", () => {
        it("should be defined", () => {
            // Expect LocalStorage to be defined
            expect(LocalStorage).toBeDefined();
        });
    });

    describe("LocalStorage#get", () => {
        it("should call window.localStorage#getItem using input key as parameter and return the result", () => {
            let key: string = "KEY_1";

            // Expect item retrieved from local storage to be equal to the initial contents
            expect(LocalStorage.get(key)).toEqual("VALUE_OF_KEY_1");

            // Expect window.localStorage#clear to have been called with (key)
            expect(window.localStorage.getItem).toHaveBeenCalledWith(key);
        });

        it("should call window.localStorage#getItem using input key as parameter and return empty string if the result is falsy", () => {
            let key: string = "UNDEFINED_KEY";

            // Expect item retrieved from local storage to be blank
            expect(LocalStorage.get(key)).toEqual("");

            // Expect window.localStorage#clear to have been called with (key)
            expect(window.localStorage.getItem).toHaveBeenCalledWith(key);
        });
    });

    describe("LocalStorage#put", () => {
        it("should call window.localStorage#putItem using input key,value as parameter", () => {
            let key: string = "KEY_2";
            let value: string = "VALUE_OF_KEY_2"

            // Execute LocalStorage#put
            LocalStorage.put(key, value);

            // Expect window.localStorage#clear to have been called with (key, value)
            expect(window.localStorage.setItem).toHaveBeenCalledWith(key, value);

            // Expect item retrieved from local storage is equal to the item put
            expect(window.localStorage.getItem(key)).toEqual(value);
        });
    });

    describe("LocalStorage#clear", () => {
        it("should call window.localStorage#clear", () => {
            // Execute LocalStorage#clear
            LocalStorage.clear();

            // Expect window.localStorage#clear to have been called
            expect(window.localStorage.clear).toHaveBeenCalled();
        });
    });
});