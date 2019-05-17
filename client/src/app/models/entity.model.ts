export abstract class Entity {
  

  constructor (private _id? : number) { }

  get id() : number { return this._id }
  set id(id : number) {
    this._id = id;
  }
}
