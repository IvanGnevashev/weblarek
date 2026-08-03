import {Component} from "./base/Component"

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected _gallery: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected _counter: HTMLElement;


    constructor(container: HTMLElement, onBasketClick: () => void) {
        super(container);
        this._gallery = this.container.querySelector('.gallery')! as HTMLElement;
        this._counter = this.container.querySelector('.header__basket-counter')! as HTMLElement;
        this._basketButton = this.container.querySelector('.header__basket')! as HTMLButtonElement;
        this._basketButton.addEventListener('click', (): void => { onBasketClick(); });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    set catalog(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    lockScroll(): void {
        document.body.style.overflow = 'hidden';
    }

    unlockScroll(): void {
        document.body.style.overflow = '';
    }
}