import {Component} from "./base/Component"

export interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    protected _price: HTMLElement;
    protected _basketList: HTMLElement;
    protected _submit: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        onSubmitClick: () => void
    ) {
        super(container);
        this._price = this.container.querySelector(".basket__price")! as HTMLElement;
        this._basketList = this.container.querySelector(".basket__list")! as HTMLElement;
        this._submit = this.container.querySelector(".basket__button")! as HTMLButtonElement;

        this._submit.addEventListener("click", () => {
            onSubmitClick();
        });
    }

    set items(value: HTMLElement[]) {
        this._basketList.replaceChildren(...value);
        this._submit.disabled = value.length === 0;
    }

    set total(value: number) {
        this._price.textContent = `${value} синапсов`;
    }
}