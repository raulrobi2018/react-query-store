import {Button, Image, Input, Textarea} from "@nextui-org/react";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {useProductMutation} from "..";

interface FormInputs {
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

export const NewProduct = () => {
    const productMutation = useProductMutation();

    const {control, handleSubmit, watch} = useForm<FormInputs>({
        defaultValues: {
            title: "Keyboard",
            price: 150,
            description: " asdñflkj añslkdjfñlkaj sdfñlkj",
            category: "men's clothing",
            image: "https://m.media-amazon.com/images/I/6103qfrVttL._AC_UF1000,1000_QL80_.jpg"
        }
    });

    //Si la imagen cambia la renderiza, es como tener un useEffect
    const newImage = watch("image");

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        productMutation.mutate(data);
    };

    return (
        <div className="w-full flex-col">
            <h1 className="text-2xl font-bold">Nuevo producto</h1>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-around items-center">
                    <div className="flex-col w-[500px]">
                        <Controller
                            control={control}
                            name="title"
                            rules={{required: true}}
                            render={({field}) => (
                                <Input
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="mt-2"
                                    type="text"
                                    label="Product title"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="price"
                            rules={{required: true}}
                            render={({field}) => (
                                <Input
                                    value={field.value?.toString()}
                                    onChange={(ev) =>
                                        field.onChange(+ev.target.value)
                                    }
                                    className="mt-2"
                                    type="number"
                                    label="Product price"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="image"
                            rules={{required: true}}
                            render={({field}) => (
                                <Input
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="mt-2"
                                    type="url"
                                    label="Product image"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="description"
                            rules={{required: true}}
                            render={({field}) => (
                                <Textarea
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="mt-2"
                                    label="Product description"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="category"
                            rules={{required: true}}
                            render={({field}) => (
                                <select
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="rounded-md p-3 mt-2 bg-gray-800 w-full"
                                >
                                    <option value="men's clothing">
                                        Men's clothing
                                    </option>
                                    <option value="women's clothing">
                                        Women's clothing
                                    </option>
                                    <option value="jewelery">Jewelery</option>
                                    <option value="electronics">
                                        Electronics
                                    </option>
                                </select>
                            )}
                        />

                        <br />
                        <Button
                            type="submit"
                            className="mt-2"
                            color="primary"
                            isDisabled={productMutation.isPending}
                        >
                            {productMutation.isPending
                                ? "Loading..."
                                : "Create"}
                        </Button>
                    </div>

                    <div
                        className="bg-white rounded-2xl p-10 flex items-center"
                        style={{
                            width: "500px",
                            height: "600px"
                        }}
                    >
                        <Image src={newImage} />
                    </div>
                </div>
            </form>
        </div>
    );
};
