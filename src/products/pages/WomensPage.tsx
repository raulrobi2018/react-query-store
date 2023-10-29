import {ProductList, useProducts} from "..";

export const WomensPage = () => {
    const {isLoading, products} = useProducts({filterKey: "women's clothing"});

    return (
        <div className="flex-col">
            <h1 className="text-2xl font-bold">Women's products</h1>

            {isLoading && <p>Loading...</p>}

            <ProductList products={products} />
        </div>
    );
};
