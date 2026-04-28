import { IBuyer, IValidationErrors, TPayment } from "../../../types";

export class BuyerModel {
    protected _payment: TPayment | '' = '';
    protected _address = '';
    protected _email = '';
    protected _phone = '';

    setPayment(payment: TPayment): void {
        this._payment = payment;
    }

    setAddress(address: string): void {
        this._address = address;
    }

    setEmail(email: string): void {
        this._email = email;
    }

    setPhone(phone: string): void {
        this._phone = phone;
    }

    getData(): IBuyer {
        return {
            payment: this._payment as TPayment,
            email: this._email,
            address: this._address,
            phone: this._phone
        };
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    validate(): IValidationErrors {
        const errors: IValidationErrors = {};

        if (!this._payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this._address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this._email.trim()) {
            errors.email = 'Введите почту';
        }
        if (!this._phone.trim()) {
            errors.phone = 'Укажите телефон'
        }
        return errors;
    }
}