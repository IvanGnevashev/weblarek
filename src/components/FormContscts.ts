import {Form, IForm} from "./Form";

export interface IFormContacts extends IForm {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IFormContacts> {
    constructor(
        container: HTMLElement,
        onInputChange: (field: string, value: string) => void,
        onSubmit: () => void
    ) {
        super(container, onInputChange, onSubmit);
    }
}