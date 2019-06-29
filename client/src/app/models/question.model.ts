import { LabSession } from './lab_session.model';
import { User } from './user.model';
import { Entity } from './entity.model';
import { Answer } from './answer.model';
import * as moment from 'moment';

export class Question extends Entity{
  private _tags : Set<string>;
  private timeDifference: string;
  private notRendered: boolean = false;

  constructor (private _date?: Date, private _text? : string,
               private _answer? : Answer, private _session? : LabSession,
               _id? : string, private _faQ? : boolean, private _asker? : User,
               private _status? : string, private _otherAskers?: User[],
               private _claimedBy?:User, private _meToo?:boolean, private _step?: string, private _smallText?: string, private _plaintext? : string) {
    super (_id);
    this._tags = new Set<string> ();
    this._faQ = false;
    this._otherAskers = new Array<User>();
    this._claimedBy = new User();

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
    //debugger
    // let tempString = "";
    this._text = text;
    this.timeDifference = moment(this.date).fromNow();
    //debugger;
    let tempString = JSON.parse(text);
    //debugger;
    tempString = tempString["ops"];
    //debugger;
    let temp: string = "";
    for(var i = 0; i < tempString.length; i++){
      //debugger;
      if(tempString[i]["insert"]["image"]=== undefined){
        temp = temp + tempString[i]["insert"];
      //  debugger;
      }
      else{
        this.notRendered = true;
        temp = temp + "[Data Could Not Be Rendered]";
      }
      //debugger;
    }

    // let temp:string = "";
    //debugger;
    temp = temp + "(" + this.timeDifference + ")";
    //debugger
    this._smallText = temp;
  }

  get smallText() : string{
    //debugger
    return this._smallText;
  }

  set smallText(text: string) {
    this._smallText = text;
  }

	get plaintext () { return this._plaintext }
	set plaintext ( text : string) { this._plaintext = text }

  get answer() : Answer {
    return this._answer;
  }

  set answer(answer : Answer) {
    this._answer = answer;
  }

  get answerText():string{
    //handles if answer is undefined
    if(this._answer === undefined){
      return "";
    }
    else{
      return this._answer.text;
    }
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

  get meToo(): boolean {
    return this._meToo;
  }

  set meToo(b: boolean){
    this._meToo = b;
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
    if (this._answer != undefined) {
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

  get step() : string{
    return this._step;
  }

  set step(step : string){
    this._step = step;
  }

static createFromJSon(o:Object){
  let question = new Question();

  question.date = o["attributes"]["created_at"];
  question.text = o["attributes"]["text"];
  question.id = o["id"];
  question.faq = o["attributes"]["faq"];
  question.status = o["attributes"]["status"];
	question.plaintext = o["attributes"]["plaintext"];
  question.asker = o["relationships"]["original_asker"]["data"];
  if(o["relationships"]["claimed_by"]!= undefined){
    question.claimedBy = o["relationships"]["claimed_by"]["data"];
  }
  if(o["relationships"]["askers"] != undefined){
    let askers: User[]  = o["relationships"]["askers"]["data"];
    for (let a of askers){
      question.otherAskers.push(a)
    }
  }
  question.step = o["attributes"]["step"];
  return question;

}


}
