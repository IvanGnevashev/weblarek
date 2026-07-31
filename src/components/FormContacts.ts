import {Form, IForm} from "./Form";

export interface IFormContacts extends IForm {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IFormContacts> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(
        container: HTMLElement,
        onInputChange: (field: string, value: string) => void,
        onSubmit: () => void
    ) {
        super(container, onInputChange, onSubmit);
        this._email = this.container.querySelector('input[name="email"]')! as HTMLInputElement;
        this._phone = this.container.querySelector('input[name="phone"]')! as HTMLInputElement;
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }
}