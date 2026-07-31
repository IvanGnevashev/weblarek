import { Component } from "./base/Component";
import { categoryMap } from '../utils/constants';

export interface ICard {
    title: string;
    price: number | null;
}

export class Card<T extends ICard> extends Component<T> {

    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = this.container.querySelector('.card__title')! as HTMLElement;
        this._price = this.container.querySelector('.card__price')! as HTMLElement;
    }

    protected updateCategory(element: HTMLElement, value: string) {
        element.textContent = value;

        element.classList.remove(...Object.values(categoryMap));

        const categoryClass =
            categoryMap[value as keyof typeof categoryMap];

        if (categoryClass) {
            element.classList.add(categoryClass);
        }
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