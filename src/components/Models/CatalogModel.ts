import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
    protected _items: IProduct[] = [];
    protected _preview: IProduct | null = null;
    protected readonly _events: IEvents;

    constructor(events: IEvents) {
        this._events = events;
    }

    setItems(items: IProduct[]): void {
        this._items = items;

        this._events.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find((item) => item.id === id);
    }

    setPreview(item: IProduct | null): void {
        this._preview = item;

        this._events.emit('preview:changed');
    }

    getPreview(): IProduct | null {
        return this._preview;
    }
}