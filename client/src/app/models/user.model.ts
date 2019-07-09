import { Entity } from './entity.model';

export class User extends Entity{
  constructor (
    private _emailAddress?: string,
    private _username?: string,
    private _firstName? : string,
    private _lastName?: string,
    private _type? : string,
    _id? : string,
    private _password? : string,
    private _role? : string,
    private _actingAsStudent? : boolean,
    private _toBeNotified? : boolean
  )
  {
    super (_id);
  }

  get EmailAddress() : string { return this._emailAddress}
  set EmailAddress(emailAddress : string)   {
    this._emailAddress = emailAddress;
  }

  get Username() : string { return this._username}
  set Username(username : string) {
    this._username = username;
  }

  get FirstName () : string {return this._firstName}
  set FirstName (firstName : string)  {
    this._firstName = firstName;
  }

  get LastName () : string {return this._lastName}
  set LastName (lastName : string)  {
    this._lastName = lastName;
  }

  get Type() : string {
    //ActingAsStudent === true means that a professor is acting as a student
    if(this._actingAsStudent === true)
    {
      return "students";
    }
    else if(this._actingAsStudent === false){
      return "professors";
    }
    else{
      return this._type;
    }
  }

  set Type(type: string) {
    this._type = type;
  }

  get Role() : string { return this._role; }
  set Role(role : string) { this._role = role;}

  //formats the users name
  get FullName() : string {
    if (!this.FirstName && !this.LastName) {
      return "";
    }
    return `${this._firstName} ${this._lastName}`;
  }

  get Password() : string { return this._password; }
  set Password(newPassword : string) {
    this._password = newPassword;
  }

  //if ActingAsStudent === true then a professor is acting as a student
  get ActingAsStudent(): boolean{
    return this._actingAsStudent;
  }

  set ActingAsStudent(b: boolean){
    this._actingAsStudent = b;
  }

  get ToBeNotified(): boolean{
    return this._toBeNotified;
  }

  set ToBeNotified(b: boolean){
    this._toBeNotified = b;
  }


  //creates an new user when given a json response
  static createFromJSon(o : Object){
    let user = new User();

    user.Type = o["type"];
    user.id = o["id"];
    let src = o["attributes"] ? o["attributes"] : o;

    user.Username = src["username"];
    user.EmailAddress = src["email"];
    user.FirstName =src["first_name"];
    user.LastName = src["last_name"];
    user.Role = src["role"];
    user.ToBeNotified = src["toBeNotified"];

    return user;
  }

}
