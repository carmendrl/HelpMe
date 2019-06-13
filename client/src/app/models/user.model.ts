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
    private _actingAsStudent? : boolean
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

  get ActingAsStudent(): boolean{
    return this._actingAsStudent;
  }

  set ActingAsStudent(b: boolean){
    this._actingAsStudent = b;
  }

  static createFromJSon(o : Object){
    let user = new User();

    user.Type = o["type"];
    user.id = o["id"];
    user.Username = o["attributes"]["username"];
    user.EmailAddress = o["attributes"]["email"];
    user.FirstName = o["attributes"]["first_name"];
    user.LastName = o["attributes"]["last_name"];
		user.Role = o["attributes"]["role"];
    return user;
  }

}
