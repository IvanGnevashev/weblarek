import './scss/styles.scss';

import { CardCatalog } from './components/CardCatalog'
import { Page } from './components/Page'
import { Modal } from './components/Modal';
import { CardPreview } from './components/CardPreview';
import { IProduct, IProductListResponse } from './types/index';
import { Basket } from './components/Basket';
import { FormOrder } from './components/FormOrder';
import { FormContacts } from './components/FormContacts';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { Api } from './components/base/Api';
import { LarekApi } from './components/api/LarekApi';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket } from './components/CardBasket';
import { Success } from './components/Success';

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

function getOrderErrors() {
    const errors = buyerModel.validate();

    const orderErrors = [];

    if (errors.payment) {
        orderErrors.push(errors.payment);
    }

    if (errors.address) {
        orderErrors.push(errors.address);
    }

    return orderErrors;
}

function getContactErrors() {
    const errors = buyerModel.validate();

    const contactErrors = [];

    if (errors.email) {
        contactErrors.push(errors.email);
    }

    if (errors.phone) {
        contactErrors.push(errors.phone);
    }

    return contactErrors;
}

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

                    // изменение полей
                    (field, value) => {
                        if (field === 'address') {
                            buyerModel.setAddress(value);
                        }

                        const orderErrors = getOrderErrors();

                        order.render({
                            valid: orderErrors.length === 0,
                            errors: orderErrors.join(', '),
                            payment: buyerModel.getData().payment ?? undefined
                        });
                    },

                    // выбор способа оплаты
                    (payment) => {
                        buyerModel.setPayment(payment);

                        const orderErrors = getOrderErrors();

                        order.render({
                            valid: orderErrors.length === 0,
                            errors: orderErrors.join(', '),
                            payment: buyerModel.getData().payment ?? undefined
                        });
                    },

                    // отправка формы
                    () => {
                        const contactsContainer = cloneTemplate('#contacts');

                        const contacts = new FormContacts(
                            contactsContainer,

                            (field, value) => {
                                if (field === 'email') {
                                    buyerModel.setEmail(value);
                                }

                                if (field === 'phone') {
                                    buyerModel.setPhone(value);
                                }

                                const contactErrors = getContactErrors();

                                contacts.render({
                                    valid: contactErrors.length === 0,
                                    errors: contactErrors.join(', ')
                                });
                            },

                            () => {
                                const order = {
                                    ...buyerModel.getData(),
                                    items: basketModel.getItems().map(item => item.id),
                                    total: basketModel.getTotal()
                                };

                                api.postOrder(order)
                                    .then((result) => {
                                        buyerModel.clear();
                                        basketModel.clear();
                                        updatePage();

                                        const successContainer = cloneTemplate('#success');

                                        const success = new Success (
                                            successContainer,
                                            () => {
                                                modal.close();
                                            }
                                        )

                                        modal.render({
                                            content: success.render({
                                                total: result.total
                                            })
                                        });
                                    })
                                    .catch((error) => {
                                        console.error('Не удалось оформить заказ:', error);

                                        contacts.render({
                                            errors: 'Не удалось оформить заказ. Попробуйте ещё раз.'
                                        });
                                    });
                            }
                        );

                        const buyerData = buyerModel.getData();
                        const contactErrors = getContactErrors();  

                        modal.render({
                            content: contacts.render({
                                email: buyerData.email,
                                phone: buyerData.phone,
                                valid: contactErrors.length === 0,
                                errors: contactErrors.join(', ')
                            })
                        });
                    }
                );

                const buyerData = buyerModel.getData();
                const orderErrors = getOrderErrors();

                modal.render({
                    content: order.render({
                        address: buyerData.address,
                        payment: buyerData.payment ?? undefined,
                        valid: orderErrors.length === 0,
                        errors: orderErrors.join(', '),
                    })
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

function testModels(products: IProduct[]) {
    const product = products[0];

    if (!product) {
        console.warn('Проверка моделей пропущена: каталог пуст');
        return;
    }

    const log = (method: string, result: unknown) => {
        console.log(`${method}:`, result);
    };

    // CatalogModel
    const testCatalog = new CatalogModel();

    testCatalog.setItems(products);
    log('CatalogModel.setItems/getItems', testCatalog.getItems());
    log('CatalogModel.getItem', testCatalog.getItem(product.id));

    testCatalog.setPreview(product);
    log('CatalogModel.setPreview/getPreview', testCatalog.getPreview());

    // BasketModel
    const testBasket = new BasketModel();

    log('BasketModel.getItems', testBasket.getItems());

    testBasket.addItem(product);
    log('BasketModel.addItem', testBasket.getItems());
    log('BasketModel.getCount', testBasket.getCount());
    log('BasketModel.getTotal', testBasket.getTotal());
    log('BasketModel.hasItem', testBasket.hasItem(product.id));

    testBasket.removeItem(product.id);
    log('BasketModel.removeItem', testBasket.getItems());

    testBasket.clear();
    log('BasketModel.clear', testBasket.getItems());

    // BuyerModel
    const testBuyer = new BuyerModel();

    testBuyer.setPayment('card');
    log('BuyerModel.setPayment', testBuyer.getData().payment);

    testBuyer.setAddress('Москва');
    log('BuyerModel.setAddress', testBuyer.getData().address);

    testBuyer.setEmail('test@mail.ru');
    log('BuyerModel.setEmail', testBuyer.getData().email);

    testBuyer.setPhone('+79999999999');
    log('BuyerModel.setPhone', testBuyer.getData().phone);

    log('BuyerModel.getData', testBuyer.getData());
    log('BuyerModel.validate', testBuyer.validate());

    testBuyer.clear();
    log('BuyerModel.clear', testBuyer.getData());
}

async function init() {
    let response: IProductListResponse;

    try {
        response = await api.getProducts();
    } catch(error) {
        console.error('Не удалось загрузить каталог:', error);
        return
    }

    catalogModel.setItems(response.items);

    console.log(
        'Товары каталога после setItems:',
        catalogModel.getItems()
    );

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

                        updatePage();
                        modal.close();
                    }
                );

                updatePreviewButton(preview, product);

                modal.render({
                    content: preview.render({
                                                ...product,
                                                image: CDN_URL + product.image
                                            })
                });
            }
        );
        return card.render({
                                ...product,
                                image: CDN_URL + product.image
                            });
        }
    );

    page.render({
        catalog: cards
    })

    updatePage();

    testModels(response.items);
}

init();