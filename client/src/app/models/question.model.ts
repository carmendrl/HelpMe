import { LabSession } from './lab_session.model';
import { User } from './user.model';
import { Entity } from './entity.model';
import { Answer } from './answer.model';

export class Question extends Entity{
  private _tags : Set<string>;

  constructor (private _date?: Date, private _text? : string,
               private _answer? : Answer, private _session? : LabSession,
               _id? : number, private _faQ? : boolean, private _asker? : User, private _status? : string, private _otherAskers?: User[], private _claimedBy?:User) {
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

  //user who asked the question
  get asker(): User {
    return this._asker;
  }

  set asker(user : User) {
    this._asker = user;
  }

  //users who clicked "me too"
  get otherAskers(): User[] {
    return this._otherAskers;
  }

  set otherAskers(users : User[]) {
    this._otherAskers = users;
  }

  get totalAskers(): number {
    return this._otherAskers.length;
  }

  //user who claimed the question (teacher/ta)
  get claimedBy(): User {
    return this._claimedBy;
  }

  set claimedBy(user : User) {
    this._claimedBy= user;
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

  get status() : string{
    return this._status;
  }

  set status(status : string){
    this._status = status;
  }

static createFromJSon(o:Object){
  let question = new Question();

  question.date = o["attributes"]["created_at"];
  question.text =o["attributes"]["text"];
  question.id= o["id"];
  question.faq= o["attributes"]["faq"];
  question.status = o["attributes"]["status"];
  question.asker=o["relationships"]["original_asker"]["data"];
  // if(o["relationships"]["claimed_by"]["data"] != undefined){
  //   question.claimedBy=o["relationships"]["claimed_by"]["data"];
  // }
  // if(o["relationships"]["asked_by"]["data"] != undefined){
  //   question.otherAskers=o["relationships"]["asked_by"]["data"];
  // }

  return question;

}


}
