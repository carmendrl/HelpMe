import { LabSession } from './lab_session.model';
import { User } from './user.model';
import { Entity } from './entity.model';
import { Answer } from './answer.model';

export class Question extends Entity{
  private _tags : Set<string>;

  constructor (private _date?: Date, private _text? : string,
               private _answer? : Answer, private _session? : LabSession,
               _id? : number, private _faQ? : boolean, private _user? : User) {
    super (_id);
    this._tags = new Set<string> ();
    this._faQ = false;
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

  get answer() : Answer {
    return this._answer;
  }

  set answer(answer : Answer) {
    this._answer = answer;
  }

  get session() : LabSession {
    return this._session;
  }

  set session(session : LabSession) {
    this._session = session;
  }

  get faq() : boolean {
    return this._faQ;
  }

  set faq(b : boolean){
    this._faQ = b;
  }

  get tags() : Set<string> {
    return this._tags;
  }

  //user who answered the question
  get user(): User {
    return this._user;
  }

  set user(user : User) {
    this._user = user;
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

static createFromJSon(o:Object){
  let question = new Question();

  question.date = o["attributes"]["created_at"];
  question.text =o["attributes"]["text"];
  question.id= o["id"];
  question.faq= false;

  return question;

}


}
