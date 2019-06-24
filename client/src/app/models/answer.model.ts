import { LabSession } from './lab_session.model';
import { User } from './user.model';
import { Entity } from './entity.model';

export class Answer extends Entity{


  constructor (private _date?: Date, private _text? : string,
  private _session?: LabSession, _id?: string, private _user?: User,
  private _status? : string, private _submitted?: boolean){
    super(_id);
    //this._submitted = false;
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

  get status() : string{
    return this._status;
  }

  set status(status : string){
    this._status = status;
  }

  get submitted(): boolean {
    return this._submitted;
  }

  set submitted(b: boolean){
    this._submitted = b;
  }

  static createFromJSon(o: Object){
    let answer = new Answer();

    answer.date = o["attributes"]["created_at"];
    answer.text = o["attributes"]["text"];
    answer.id = o["id"];
    answer.status = o["attributes"]["status"];
    answer.submitted = o["attributes"]["submitted"];
//lab session and user should be in the included part.
  return answer;
  }

}
