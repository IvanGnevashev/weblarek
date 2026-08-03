import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { LarekApi } from './components/api/LarekApi';

import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { CardBasket } from './components/CardBasket';
import { FormOrder } from './components/FormOrder';
import { TPayment, IProduct } from './types';
import { FormContacts } from './components/FormContacts';
import { Success } from './components/Success';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Брокер событий

const events = new EventEmitter();

// Модели данных

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// Слой коммуникации

const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

// Слой представления

const page = new Page(
    ensureElement('.page__wrapper'),
    () => {
        events.emit('basket:open');
    }
);

const modal = new Modal(
    ensureElement('#modal-container'),
    events
);

const preview = new CardPreview(
    cloneTemplate('#card-preview'),
    () => {
        events.emit('preview:action');
    }
);

// События каталога

events.on('catalog:changed', () => {
    const cards = catalogModel.getItems().map((product) => {
        const card = new CardCatalog(
            cloneTemplate('#card-catalog'),
            () => {
                events.emit('card:select', {
                    id: product.id
                });
            }
        );

        return card.render(product);
    });

    page.catalog = cards;
});

// Выбор товара

events.on<{ id: string }>('card:select', ({ id }) => {
    const product = catalogModel.getItem(id);

    if (!product) {
        return;
    }

    catalogModel.setPreview(product);
});

// Отображение выбранного товара

events.on('preview:changed', () => {
    const product = catalogModel.getPreview();

    if (!product) {
        return;
    }

    let buttonText: string;
    let buttonDisabled: boolean;

    if (product.price === null) {
        buttonText = 'Недоступно';
        buttonDisabled = true;
    } else if (basketModel.hasItem(product.id)) {
        buttonText = 'Удалить из корзины';
        buttonDisabled = false;
    } else {
        buttonText = 'Купить';
        buttonDisabled = false;
    }

    modal.render({
        content: preview.render({
            ...product,
            buttonText,
            buttonDisabled
        })
    });
});

// Добавление или удаление товара через превью

events.on('preview:action', () => {
    const product = catalogModel.getPreview();

    if (!product || product.price === null) {
        return;
    }

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        basketModel.addItem(product);
    }

    modal.close();
});

// Обновление интерфейса после изменения корзины

events.on('basket:changed', () => {
    page.counter = basketModel.getCount();

    renderBasket();
});

const basket = new Basket(
    cloneTemplate('#basket'),
    () => {
        events.emit('order:open');
    }
);

page.counter = basketModel.getCount();

const order = new FormOrder(
    cloneTemplate('#order'),

    (field, value) => {
        events.emit('order:input', {
            field,
            value
        });
    },

    (payment) => {
        events.emit('order:payment', {
            payment
        });
    },

    () => {
        events.emit('order:submit');
    }
);

const contacts = new FormContacts(
    cloneTemplate('#contacts'),

    (field, value) => {
        events.emit('contacts:input', {
            field,
            value
        });
    },

    () => {
        events.emit('contacts:submit');
    }
);

const success = new Success(
    cloneTemplate('#success'),
    () => {
        events.emit('success:close');
    }
);

function renderBasket(): HTMLElement {
    const cards = basketModel.getItems().map((product, index) => {
        const card = new CardBasket(
            cloneTemplate('#card-basket'),
            () => {
                events.emit('basket:remove', {
                    id: product.id
                });
            }
        );

        return card.render({
            ...product,
            index: index + 1
        });
    });

    return basket.render({
        items: cards,
        total: basketModel.getTotal()
    });
}

function getOrderErrors(): string[] {
    const errors = buyerModel.validate();
    const orderErrors: string[] = [];

    if (errors.payment) {
        orderErrors.push(errors.payment);
    }

    if (errors.address) {
        orderErrors.push(errors.address);
    }

    return orderErrors;
}

function getContactErrors(): string[] {
    const errors = buyerModel.validate();
    const contactErrors: string[] = [];

    if (errors.email) {
        contactErrors.push(errors.email);
    }

    if (errors.phone) {
        contactErrors.push(errors.phone);
    }

    return contactErrors;
}

function renderOrder(): HTMLElement {
    const buyerData = buyerModel.getData();
    const orderErrors = getOrderErrors();

    return order.render({
        address: buyerData.address,
        payment: buyerData.payment ?? undefined,
        valid: orderErrors.length === 0,
        errors: orderErrors.join(', ')
    });
}

function renderContacts(): HTMLElement {
    const buyerData = buyerModel.getData();
    const contactErrors = getContactErrors();

    return contacts.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: contactErrors.length === 0,
        errors: contactErrors.join(', ')
    });
}

// Открытие корзины

events.on('basket:open', () => {
    modal.render({
        content: renderBasket()
    });
});

// Закрытие модального окна

events.on('modal:open', () => {
    page.lockScroll();
});

events.on('modal:close', () => {
    page.unlockScroll();
});

events.on('success:close', () => {
    modal.close();
});

// Удаление товара из корзины

events.on<{ id: string }>('basket:remove', ({ id }) => {
    basketModel.removeItem(id);
});

// Открытие первого этапа заказа

events.on('order:open', () => {
    modal.render({
        content: renderOrder()
    });
});

// Изменение поля первого этапа

events.on<{ field: string; value: string }>(
    'order:input',
    ({ field, value }) => {
        if (field === 'address') {
            buyerModel.setAddress(value);
        }
    }
);

// Изменение способа оплаты

events.on<{ payment: TPayment }>(
    'order:payment',
    ({ payment }) => {
        buyerModel.setPayment(payment);
    }
);

// Переход ко второму этапу заказа

events.on('order:submit', () => {
    modal.render({
        content: renderContacts()
    });
});

// Изменение полей контактов

events.on<{ field: string; value: string }>(
    'contacts:input',
    ({ field, value }) => {
        if (field === 'email') {
            buyerModel.setEmail(value);
        }

        if (field === 'phone') {
            buyerModel.setPhone(value);
        }
    }
);

// Отправка заказа

events.on('contacts:submit', async () => {
    const buyerData = buyerModel.getData();

    contacts.render({
        valid: false,
        errors: ''
    });

    try {
        const result = await api.postOrder({
            ...buyerData,
            payment: buyerData.payment,
            items: basketModel.getItems().map((item) => item.id),
            total: basketModel.getTotal()
        });

        basketModel.clear();
        buyerModel.clear();

        modal.render({
            content: success.render({
                total: result.total
            })
        });
    } catch (error) {
        console.error('Не удалось оформить заказ:', error);

        contacts.render({
            valid: true,
            errors: 'Не удалось оформить заказ. Попробуйте ещё раз.'
        });
    }
});

// Обновление форм после изменения данных покупателя

events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();

    const orderErrors = getOrderErrors();
    const contactErrors = getContactErrors();

    order.render({
        payment: buyerData.payment ?? undefined,
        address: buyerData.address,
        valid: orderErrors.length === 0,
        errors: orderErrors.join(', ')
    });

    contacts.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: contactErrors.length === 0,
        errors: contactErrors.join(', ')
    });
});

// Первоначальная загрузка данных

async function init() {
    try {
        const response = await api.getProducts();

        const products = response.items.map((product) => ({
            ...product,
            image: CDN_URL + product.image
        }));

        catalogModel.setItems(products);

        console.log(
            '[Каталог, сохранённый в CatalogModel]',
            catalogModel.getItems()
        );

        testModels(products);
    } catch (error) {
        console.error('Не удалось загрузить каталог:', error);
    }
}

function testModels(products: IProduct[]): void {
    const product = products[0];

    if (!product) {
        console.warn('Проверка моделей пропущена: каталог пуст');
        return;
    }

    const testEvents = new EventEmitter();

    const testCatalog = new CatalogModel(testEvents);
    const testBasket = new BasketModel(testEvents);
    const testBuyer = new BuyerModel(testEvents);

    const log = (method: string, result: unknown): void => {
        console.log(`[Проверка ${method}]`, result);
    };

    // CatalogModel

    testCatalog.setItems(products);
    log('CatalogModel.setItems/getItems', testCatalog.getItems());
    log('CatalogModel.getItem', testCatalog.getItem(product.id));

    testCatalog.setPreview(product);
    log('CatalogModel.setPreview/getPreview', testCatalog.getPreview());

    // BasketModel

    log('BasketModel.getItems', testBasket.getItems());

    testBasket.addItem(product);
    log('BasketModel.addItem', testBasket.getItems());
    log('BasketModel.getTotal', testBasket.getTotal());
    log('BasketModel.getCount', testBasket.getCount());
    log('BasketModel.hasItem', testBasket.hasItem(product.id));

    testBasket.removeItem(product.id);
    log('BasketModel.removeItem', testBasket.getItems());

    testBasket.clear();
    log('BasketModel.clear', testBasket.getItems());

    // BuyerModel

    testBuyer.setPayment('card');
    log('BuyerModel.setPayment', testBuyer.getData().payment);

    testBuyer.setAddress('Москва');
    log('BuyerModel.setAddress', testBuyer.getData().address);

    testBuyer.setEmail('test@example.com');
    log('BuyerModel.setEmail', testBuyer.getData().email);

    testBuyer.setPhone('+79999999999');
    log('BuyerModel.setPhone', testBuyer.getData().phone);

    log('BuyerModel.getData', testBuyer.getData());
    log('BuyerModel.validate', testBuyer.validate());

    testBuyer.clear();
    log('BuyerModel.clear', testBuyer.getData());
}

init();