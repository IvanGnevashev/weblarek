import './scss/styles.scss';

import { CardCatalog } from './components/CardCatalog'
import { Page } from './components/Page'
import { Modal } from './components/Modal';
import { CardPreview } from './components/CardPreview';
import { IProduct } from './types/index';
import { Basket } from './components/Basket';
import { FormOrder } from './components/FormOrder';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { Api } from './components/base/Api';
import { LarekApi } from './components/api/LarekApi';

import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket } from './components/CardBasket';

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

const page = new Page(
    ensureElement('.page__wrapper'),
    () => {
        openBasket();
    }
);

function openBasket() {
    const items = basketModel.getItems();
    const basketContainer = cloneTemplate('#basket')

    const cards = items.map( (product, index) => {
            const container = cloneTemplate('#card-basket');

            const card = new CardBasket(
                container,
                () => {
                    basketModel.removeItem(product.id);

                    openBasket();
                    updatePage();
                }
            )

            return card.render({
                ...product,
                index: index + 1
            });
        })

    const basket = new Basket(
            basketContainer,
            () => {
                const orderContainer = cloneTemplate('#order');

                const order = new FormOrder(
                    orderContainer,
                    (field, value) => {
                        if (field === 'address') {
                            buyerModel.setAddress(value);
                        }

                        const errors = buyerModel.validate();
                        const data = buyerModel.getData();

                        order.render({
                            valid: Object.keys(errors).length === 0,
                            errors: Object.values(errors).join(", "),
                            payment: data.payment
                        });
                    },
                    (payment) => {
                        buyerModel.setPayment(payment);

                        const errors = buyerModel.validate();
                        const data = buyerModel.getData();

                        order.render({
                            valid: Object.keys(errors).length === 0,
                            errors: Object.values(errors).join(", "),
                            payment: data.payment
                        });
                    }
                );

                modal.render({
                    content: order.render()
                });
            }
    )

    modal.render({
        content: basket.render({
            items: cards,
            total: basketModel.getTotal()
        })
    });
}

const modal = new Modal(
    ensureElement('#modal-container'),
    () => {
        modal.close();
    }
);

function updatePage() {
    page.render({
        counter: basketModel.getCount()
    });
}

function updatePreviewButton(
    preview: CardPreview,
    product: IProduct
) {
    if (product.price === null) {
        preview.button = 'disabled';    
    } else if (basketModel.hasItem(product.id)) {
        preview.button = 'remove';
    } else {
        preview.button = 'buy';
    };
}

async function init() {
    const response = await api.getProducts();

    catalogModel.setItems(response.items);
    console.log(response);

    const cards = catalogModel.getItems().map( product => {
        const container = cloneTemplate('#card-catalog');
        const card = new CardCatalog(
            container,
            () => {
                catalogModel.setPreview(product);

                const previewContainer = cloneTemplate('#card-preview');

                const preview = new CardPreview(
                    previewContainer,
                    () => {
                        const product = catalogModel.getPreview();

                        if (!product) {
                            return;
                        }

                        if (basketModel.hasItem(product.id)) {
                            basketModel.removeItem(product.id);
                        } else {
                            basketModel.addItem(product);
                        }

                        updatePreviewButton(preview, product);
                        updatePage();
                    }
                );

                updatePreviewButton(preview, product);

                modal.render({
                    content: preview.render(product)
                });
            }
        );
        return card.render(product);
        }
    );
    console.log(cards);

    page.render({
        catalog: cards
    })

    updatePage();
}

init();

console.log("init");