import { Entity } from './entity.model';

export class User extends Entity{
  constructor (
    private _emailAddress?: string,
    private _username?: string,
    private _firstName? : string,
    private _lastName?: string,
    private _type? : string,
    _id? : number,
    private _password? : string)
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

  get Type() : string { return this._type}
  set Type(type: string) {
    this._type = type;
  }

  get FullName() : string {
    return `${this._firstName} ${this._lastName}`;
  }

  get Password() : string { return this._password; }
  set Password(newPassword : string) {
    this._password = newPassword;
  }

 static createFromJSon(o : Object){
     let user = new User();

     user.Type = o["type"];
     user.id = o["id"];
     user.EmailAddress = o["attributes"]["email"];
     user.Username = o["attributes"]["username"];
     user.FirstName = o["attributes"]["first_name"];
     user.LastName = o["attributes"]["last_name"];

     return user;
   }

}
