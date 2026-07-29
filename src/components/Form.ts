import {Component} from "./base/Component"

export interface IForm {
    valid: boolean;
    errors: string;
}

export class Form extends Component<IForm> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(
    container: HTMLElement,
    onInputChange: (field: string, value: string) => void,
    onSubmit: () => void
    ) {
        super(container);
        this._submit = this.container.querySelector('button[type="submit"]')! as HTMLButtonElement;
        this._errors = this.container.querySelector('.form__errors')! as HTMLElement;

        this.container.addEventListener("input", (event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) {
                onInputChange(target.name, target.value);
            }
        })

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            onSubmit();
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this._errors.textContent = value;
    }
    
}