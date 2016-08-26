import {ILocalStorage} from "../services";

export class LocalStorage implements ILocalStorage {

    public get(key: string): string {
        let value = window.localStorage.getItem(key);

        if (value) {
            return value;
        }

        return "";
    }

    public put(key: string, value: string): void {
        window.localStorage.setItem(key, value);
    }

    public clear() {
        window.localStorage.clear();
    }
    
}