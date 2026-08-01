import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketModel {
    protected _items: IProduct[] = [];
    protected readonly _events: IEvents;

    constructor(events: IEvents) {
        this._events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
        this._events.emit('basket:changed');
    }

    removeItem(id: string): void {
        this._items = this._items.filter((item) => item.id !== id);
        this._events.emit('basket:changed');
    }

    clear(): void {
        this._items = [];
        this._events.emit('basket:changed');
    }

    getTotal(): number {
        return this._items.reduce(
            (sum, item) => sum + (item.price || 0),
            0
        );
    }

    getCount(): number {
        return this._items.length;
    }

    hasItem(id: string): boolean {
        return this._items.some((item) => item.id === id);
    }
}