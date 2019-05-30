import { LabSession } from './lab_session.model';

import { Entity } from './entity.model';

export class Question extends Entity{
  private _tags : Set<string>;

  constructor (private _date?: Date, private _text? : string,
               private _answer? : string, private _session? : LabSession,
               _id? : number) { 
    super (_id);
    this._tags = new Set<string> ();
  }

  get date() : Date {
    return this._date;
  }

  set date(newDate : Date) {
    this._date = newDate;
  }

  get text() : string {
    return this._text;
  }

  set text(text : string) {
    this._text = text;
  }

  get answer() : string {
    return this._answer;
  }

  set answer(answer : string) {
    this._answer = answer;
  }

  get session() : LabSession {
    return this._session;
  }

  set session(session : LabSession) {
    this._session = session;
  }

  get tags() : Set<string> {
    return this._tags;
  }

  public addTag (tag : string) : boolean {
    if (this._tags.has(tag)) return false;

    this._tags.add(tag);
    return true;
  }

  public removeTag (tag : string) : boolean {
    if (this._tags.has(tag)) {
      this._tags.delete(tag);
      return true;
    }

    return false;
  }

  get isAnswered() : boolean {
    if (this._answer) {
      return true;
    }
    else {
      return false;
    }
  }
}
