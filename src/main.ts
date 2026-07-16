import './scss/styles.scss';

import { CardCatalog } from './components/CardCatalog'
import { Page } from './components/Page'
import {  } from ''

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { Api } from './components/base/Api';
import { LarekApi } from './components/api/LarekApi';

import { API_URL } from './utils/constants';

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

async function init() {
    const response = await api.getProducts();

    catalogModel.setItems(response.items);

    const cards = catalogModel.getItems().map( product => {
        const container = cloneTemplate('#card-catalog');
        const card = new CardCatalog(
            container,
            () => {
                
            }
        );
        return card.render(product);
        }
    );

    page.render({
        counter: 0,
        catalog: cards
    })
}

init();

const page = new Page(...)