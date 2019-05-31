import { LabSession } from './lab_session.model';
import { User } from './user.model';
import { Entity } from './entity.model';

export class Answer extends Entity{


  constructor (private _date?: Date, private _text? : string,
  private _session?: LabSession, _id?: number, private _user?: User){
    super(_id);
  }

  get date(): Date{
    return this._date;
  }

  set date(newDate : Date){
    this._date = newDate;
  }

  get text(): string{
    return this._text;
  }

  set text(text : string){
    this._text = text;
  }

  get session() : LabSession{
    return this._session;
  }

  set session(session : LabSession){
    this._session = session;
  }


  get user() : User{
    return this._user;
  }

  set user(user : User) {
    this._user = user;
  }


}
