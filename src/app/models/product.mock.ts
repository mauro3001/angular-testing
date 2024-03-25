import { faker } from '@faker-js/faker';
import { Product } from './product.model';

export const generateProduct = (): Product => {
  return {
    id: faker.string.uuid(), // '1'
    title: faker.commerce.productName(), // 'Awesome product'
    price: parseInt(faker.commerce.price()), // 123, normally it's a string to put the currency symbol
    images: [faker.image.url(), faker.image.url()], // ['http://placeimg.com/640/480', 'http://placeimg.com/640/480']
    description: faker.commerce.productDescription(), // 'This is an awesome product'
    category: {
      id: faker.number.int(), // 1
      name: faker.commerce.department(), // 'Electronics'
    },
  };
};

export const generateManyProducts = (size = 10): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < size; i++) {
    products.push(generateProduct());
  }
  return [...products];
};
