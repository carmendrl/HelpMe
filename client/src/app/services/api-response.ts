import * as HttpStatus from 'http-status-codes';
import { HttpErrorResponse } from '@angular/common/http';
export class ApiResponse<T> {
	constructor (private _success : boolean, private _data? : T, private _statusCode? : number, private _errorMessages? : string[]) {
		this._errorMessages = new Array<string> ();
		if (!this._statusCode) {
			this._statusCode = HttpStatus.OK;
		}
	}

	get Successful () : boolean {
		return this._success;
	}

	set Successful (wasSuccessful : boolean) {
		this._success = wasSuccessful;
	}

	get HttpStatusCode() : number { return this._statusCode; }
	set HttpStatusCode(code : number) { this._statusCode = code;}

	get ErrorMessages () : string[] {
		return this._errorMessages;
	}

	get Data() : T {
		return this._data;
	}

	set Data(data : T) {
		this._data = data;
	}

	addError (message : string) {
		this._errorMessages.push(message);
	}

	get ErrorsAsString() : string {
		return this._errorMessages.join(",");
	}

	addErrorsFromHttpError (error : HttpErrorResponse) {
		this.HttpStatusCode = error.status
		if (error.error.error) {
		 	this.addError(error.error.error.message);
		}
		else {
			if (error.error) {
				this.addError(error.error);
			}
			else {
				this.addError("An unknown HTTP error occurred");
			}
		}
	}
}
