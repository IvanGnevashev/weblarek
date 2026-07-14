import {Card, ICard} from "./Card"

interface ICardCatalog extends ICard {
    image: string;
    category: string;
}

class CardCatalog extends Card {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(
    container: HTMLElement,
    onCardSelect: () => void
) {
    super(container);

    this._image = this.container.querySelector('.card__image')! as HTMLImageElement;
    this._category = this.container.querySelector('.card__category')! as HTMLElement;

    this.container.addEventListener('click', () => {
        onCardSelect();
    });
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
         this._category.classList.add('')
         break;
}
}
}