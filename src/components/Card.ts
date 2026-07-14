import { Component } from "./base/Component";

export interface ICard {
   _title: string;
   _price: string;
 
}

export class Card extends Component<ICard> {

    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = this.container.querySelector('.card__title')! as HTMLElement;
        this._price = this.container.querySelector('.card__price')! as HTMLElement;
    }

    set title(value: string) { 
        this._title.textContent = value;
    }

    set price(value: number | null) { 
        if (value === null) {
    this._price.textContent = 'Бесценно';
    } else {
        this._price.textContent = `${value} синапсов`;
    }
    }

}