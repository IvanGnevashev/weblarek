import {Form} from "./Form";

export interface IFormContacts {
    email: string;
    phone: string;
}

export class FormContacts extends Form {
    constructor(
        container: HTMLElement,
        onInputChange: (field: string, value: string) => void,
        onSubmit: () => void
    ) {
        super(container, onInputChange, onSubmit);
    }
}