import {TaskStatus} from "../models";

export class Task {

	private _id: number;

    private _title: string;

    private _description: string;

	private _status: TaskStatus = TaskStatus.NotStarted;

	private _dateCreated: Date;

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}
	
	public get title(): string {
		return this._title;
	}

	public set title(value: string) {
		this._title = value;
	}

	public get description(): string {
		return this._description;
	}

	public set description(value: string) {
		this._description = value;
	}

	public get status(): TaskStatus {
		return this._status;
	}

	public set status(value: TaskStatus) {
		this._status = value;
	}

	public get dateCreated(): Date {
		return this._dateCreated;
	}

	public set dateCreated(value: Date) {
		this._dateCreated = value;
	}

}