import { IProduct } from "../../types";

export class CatalogModel {
    protected _items: IProduct[] = [];
    protected _preview: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this._items = items;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setPreview(item: IProduct | null): void {
        this._preview = item;
    }

    getPreview(): IProduct | null {
        return this._preview;
    }
}