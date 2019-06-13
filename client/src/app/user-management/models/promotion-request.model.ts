import { Entity } from '../../models/entity.model';
import { User } from '../../models/user.model';

export class PromotionRequest extends Entity {

	constructor (_id? : string, private _user? : User,
		private _promotedBy? : User, private _expiresOn? : Date,
		private _confirmedOn? : Date, private _createdAt? : Date
	) {
		super (_id)
	}

	get User() : User { return this._user }
	set User(user : User) { this._user = user }

	get PromotedBy() : User { return this._promotedBy }
	set PromotedBy (user : User) { this._promotedBy = user }

  get CreatedAt() : Date { return this._createdAt }
	set CreatedAt( createDate : Date) { this._createdAt = createDate }

	static createFromJSon (o : any) : PromotionRequest {
		let pr : PromotionRequest = new PromotionRequest();
		pr.id = o["id"];
		pr.CreatedAt = new Date(o["attributes"]["created_at"]);
		return pr;
	}
}
