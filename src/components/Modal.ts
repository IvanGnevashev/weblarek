import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _close: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents
    ) {
        super(container);
        this._close = this.container.querySelector('.modal__close')! as HTMLButtonElement;
        this._content = this.container.querySelector('.modal__content')! as HTMLElement;

        this._close.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === event.currentTarget) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    render(data: IModal): HTMLElement {
        const result = super.render(data);
        this.open();
        return result;
    }
}