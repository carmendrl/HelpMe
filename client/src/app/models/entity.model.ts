export abstract class Entity {
	constructor(private _id?: string) { }

	get id(): string { return this._id }
	set id(id: string) {
		this._id = id;
	}
}
