import { Component } from "./base/Component";

export interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected _close: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(
    container: HTMLElement,
    onClose: () => void
    ) {
        super(container);
        this._close = this.container.querySelector('.modal__close')! as HTMLButtonElement;
        this._content = this.container.querySelector('.modal__content')! as HTMLElement;

        this._close.addEventListener("click", () => {
            onClose();
        })

        this.container.addEventListener('click', (event) => {
             if (event.target === event.currentTarget) {
                onClose();
             }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal__actions');
    }

    close() {
        this.container.classList.remove('modal__actions');
    }

    render(data: IModal): HTMLElement {
        const result = super.render(data);
        this.open();
        return result;
    }

    
}