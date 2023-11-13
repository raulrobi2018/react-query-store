import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Product, productActions} from "..";

export const useProductMutation = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        //Aquí se manda la referencia de la función que vamos a utilizar
        //El mutationFn recibirá la data y se la enviará a esta función
        mutationFn: productActions.createProduct,

        //Optimistic updates
        onMutate: (product) => {
            console.log("Muting - optimistic update");
            //Optimistic product
            const optimisticProduct = {id: Math.random(), ...product};

            //Save the product cache in the query client
            queryClient.setQueryData<Product[]>(
                ["products", {filterKey: product.category}],
                (old) => {
                    //Si no había nada retorna el primero
                    if (!old) return [optimisticProduct];

                    return [...old, optimisticProduct];
                }
            );

            return {optimisticProduct};
        },

        onSuccess: (product, vars, context) => {
            console.log(product, vars, context);
            //Invalida el query de "women's clothing"
            // queryClient.invalidateQueries({
            //     queryKey: ["products", {filterKey: product.category}]
            // });

            //Remuevo del cache el producto optimista
            queryClient.removeQueries({
                queryKey: ["product", context?.optimisticProduct.id]
            });

            //Esta es una forma de actualizar el query actual del cache
            queryClient.setQueryData<Product[]>(
                ["products", {filterKey: product.category}],
                (old) => {
                    //Si no había nada en nuestro query anterior devolvemos el creado
                    if (!old) return [product];

                    //Para inserción común utilizar esta línea
                    //return [...old, product];

                    //Para actualizar producto optimista usar esta
                    return old.map((cacheProduct) => {
                        return cacheProduct.id === context?.optimisticProduct.id
                            ? product
                            : cacheProduct;
                    });
                }
            );
        },
        //Este método se ejecuta cuando terminá de realizar la tarea
        onSettled: () => {
            console.log("Adding product finished");
        },
        onError: (error, vars, context) => {
            //Implementación para optimistic product en caso de que falle la creación
            //del producto, se elimina de los caches
            queryClient.removeQueries({
                queryKey: ["product", context?.optimisticProduct.id]
            });

            queryClient.setQueryData<Product[]>(
                ["products", {filterKey: vars.category}],
                (old) => {
                    //Si no había nada en nuestro query anterior devolvemos el creado
                    if (!old) return [];

                    //Eliminar producto optimista
                    return old.filter((cacheProduct) => {
                        return (
                            cacheProduct.id !== context?.optimisticProduct.id
                        );
                    });
                }
            );
        }
    });

    return mutation;
};
