import { IApi, IProductListResponse, IOrderRequest, IOrderResponse } from "../../types";

export class LarekApi {
    private _api: IApi;
    constructor(api: IApi) {
        this._api = api;
    }
    getProducts(): Promise<IProductListResponse> {
        return this._api.get<IProductListResponse>('/product/');
    }
    postOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
        return this._api.post<IOrderResponse>('/order/', orderData);
    }
}