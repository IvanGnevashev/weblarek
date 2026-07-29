import {Card, ICard} from "./Card"

export interface ICardBasket extends ICard{
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected _index: HTMLElement;
    protected _delete: HTMLButtonElement;

    constructor(
    container: HTMLElement,
    onDeleteClick: () => void
    ) {
        super(container);
        this._index = this.container.querySelector('.basket__item-index')! as HTMLElement;
        this._delete = this.container.querySelector('.basket__item-delete')! as HTMLButtonElement;

        this._delete.addEventListener("click", () => {
            onDeleteClick();
        })
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}

