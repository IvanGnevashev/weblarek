import { Card, ICard, setCategory } from './Card';

export interface ICardPreview extends ICard {
    image: string;
    category: string;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
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
    setCategory(this._category, value);
}

set description(value: string) {
    this._description.textContent = value;
}
}