import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { LarekApi } from './components/api/LarekApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

const catalog = new CatalogModel();
const basket = new BasketModel();
const buyer = new BuyerModel();
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

// --- Тестирование CatalogModel ---
catalog.setItems(apiProducts.items);
console.log('Каталог (мок):', catalog.getItems());
console.log('Товар по id:', catalog.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

catalog.setPreview(catalog.getItem('854cef69-976d-4c2a-a18c-2aa45046c390') ?? null);
console.log('Превью товара:', catalog.getPreview());


// --- Тестирование BasketModel ---
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log('Корзина:', basket.getItems());
console.log('Количество:', basket.getCount());
console.log('Сумма:', basket.getTotal());
console.log('Товар в корзине:', basket.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

basket.removeItem(apiProducts.items[0].id);
console.log('После удаления:', basket.getItems());

basket.clear();
console.log('После очистки:', basket.getItems());

// --- Тестирование BuyerModel ---
buyer.setPayment('card');
buyer.setAddress('ул. Пушкина');
buyer.setEmail('test@test.ru');
buyer.setPhone('+79991234567');

console.log('Данные покупателя:', buyer.getData());
console.log('Ошибки валидации:', buyer.validate());

buyer.clear();
console.log('После очистки:', buyer.getData());
console.log('Ошибки:', buyer.validate());

// --- Запрос к серверу ---
api.getProducts()
    .then((data) => {
        catalog.setItems(data.items);
        console.log('Каталог с сервера:', catalog.getItems());
    })
    .catch((err) => {
        console.error('Ошибка получения каталога:', err);
    });