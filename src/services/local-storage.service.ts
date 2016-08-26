export interface ILocalStorage {

    get(key: string): string;

    put(key: string, value: string): void

    clear(): void;

}