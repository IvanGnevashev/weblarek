import {Card, ICard} from "./Card"

export interface ICardPreview extends ICard {
    image: string;
    category: string;
    description: string;
    button: 'buy' | 'remove' | 'disabled';
}

export class CardPreview extends Card<ICardPreview> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(
    container: HTMLElement,
    onButtonClick: () => void
) {
    super(container);

    this._image = this.container.querySelector('.card__image')! as HTMLImageElement;
    this._category = this.container.querySelector('.card__category')! as HTMLElement;
    this._description = this.container.querySelector('.card__text')! as HTMLElement;
    this._button = this.container.querySelector('.card__button')! as HTMLButtonElement;

    this._button.addEventListener("click", () => {
        onButtonClick();
    })
}

set image(value: string) {
    this._image.src = value;
}

set category(value: string) {
    this._category.textContent = value;
    this._category.classList.remove('card__category_soft');
    this._category.classList.remove('card__category_other');
    switch (value) {
    case 'софт-скил':
        this._category.classList.add('card__category_soft')
        break;

    case 'другое':
        this._category.classList.add('card__category_other')
        break;
    default: 
         break;
}
}

set description(value: string) {
    this._description.textContent = value;
}

set button(value: 'buy' | 'remove' | 'disabled') {
    switch (value) {
        case 'buy':
            this._button.textContent = "Купить";
            this._button.disabled = false;
            break;

        case 'remove':
            this._button.textContent = "Удалить из корзины";
            this._button.disabled = false;
            break;

        case 'disabled':
            this._button.textContent = 'Недоступно';
            this._button.disabled = true;
            break;
    }
}
}