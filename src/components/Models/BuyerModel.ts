import {
    IBuyer,
    IValidationErrors,
    TPayment
} from '../../types';

import { IEvents } from '../base/Events';

export class BuyerModel {
    protected _payment: TPayment | null = null;
    protected _address = '';
    protected _email = '';
    protected _phone = '';

    protected readonly _events: IEvents;

    constructor(events: IEvents) {
        this._events = events;
    }

    protected emitChanges(): void {
        this._events.emit('buyer:changed');
    }

    setPayment(payment: TPayment): void {
        this._payment = payment;
        this.emitChanges();
    }

    setAddress(address: string): void {
        this._address = address;
        this.emitChanges();
    }

    setEmail(email: string): void {
        this._email = email;
        this.emitChanges();
    }

    setPhone(phone: string): void {
        this._phone = phone;
        this.emitChanges();
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            address: this._address,
            phone: this._phone
        };
    }

    clear(): void {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';

        this.emitChanges();
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
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}