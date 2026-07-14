import {Form} from "./Form";
import { TPayment } from "../types";

export interface IFormOrder {
    payment: TPayment;
}

export class FormOrder extends Form {
    protected _address: HTMLInputElement;
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        onInputChange: (field: string, value: string) => void,
        onPaymentChange: (payment: TPayment) => void
    ) {
        super(container, onInputChange);
        this._address = this.container.querySelector('input[name="address"]')! as HTMLInputElement;
        this._cardButton = this.container.querySelector('button[name="card"]')! as HTMLButtonElement;
        this._cashButton = this.container.querySelector('button[name="cash"]')! as HTMLButtonElement;

        this._cardButton.addEventListener("click", () => {
            onPaymentChange("card");
        })
        this._cashButton.addEventListener("click", () => {
            onPaymentChange("cash");
        })
    }
    set payment(value: TPayment) {
        this._cardButton.classList.remove('button_alt-active');
        this._cashButton.classList.remove('button_alt-active');

        switch (value) {
            case 'card':
                this._cardButton.classList.add('button_alt-active');
                break;

            case 'cash':
                this._cashButton.classList.add('button_alt-active');
                break;
        }
    }
}