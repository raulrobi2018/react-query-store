import {type Product, productsApi} from "..";

interface GetProductOptions {
    filterKey?: string;
}

export interface ProductLike {
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

const sleep = (seconds: number): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
};

export const getProducts = async ({
    filterKey
}: GetProductOptions): Promise<Product[]> => {
    const filterUrl = filterKey ? `category=${filterKey}` : "";

    const {data} = await productsApi.get<Product[]>(`/products?${filterUrl}`);

    return data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const {data} = await productsApi.get<Product>(`/products/${id}`);

    return data;
};

export const createProduct = async (product: ProductLike) => {
    await sleep(5);

    const {data} = await productsApi.post<Product>("/products", product);
    return data;
};
