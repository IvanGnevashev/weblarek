import {Card, ICard} from "./Card"

export interface ICardCatalog extends ICard {
    image: string;
    category: string;
}

export class CardCatalog extends Card<ICardCatalog> {
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
    this.updateCategory(this._category, value);
}
}