import {Component} from "./base/Component"

export interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _description: HTMLElement;
    protected _close: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        onClose: () => void
    ) {
        super(container);
        this._description = this.container.querySelector(".order-success__description")! as HTMLElement;
        this._close = this.container.querySelector(".order-success__close")! as HTMLButtonElement;

        this._close.addEventListener("click", () => {
            onClose();
        })
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`
    }
}