import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";



function AdminProductTile({
    product,
    setFormData,
    setOpenCreateProductsDialog,
    setCurrentEditedId,
    handleDelete,
})


{
    return (
        <Card className="w-full max-w-sm mx-auto">
            <div>
                <div className="relative">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                </div>
                <CardContent>
                    <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className={`${product?.salePrice > 0 ? "line-through" : ""
                                } text-lg font-semibold text-primary`}
                        >
                            ${product?.price}
                        </span>
                        {product?.salePrice > 0 ? (
                            <span className="text-lg font-bold">${product?.salePrice}</span>
                        ) : null}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Button
                        onClick={() => {
                        setOpenCreateProductsDialog(true);
                        setCurrentEditedId(product?._id);
                        setFormData(product);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(product?._id)}
                    >
                        Delete
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
}

// function adminProductTile({product, onEdit, onDelete}) {
//     return (
//         <div className="product-tile">
//             <div className="product-image">
//                 <img src={product.image} alt={product.title} />
//             </div>
//             <div className="product-details">
//                 <h3>{product.title}</h3>
//                 <div className="product-description">
//                     <p>{product.description}</p>
//                 </div>
//                 <div className="product-price">
//                     <p>Price: {product.price}</p>
//                     <p>Sale Price: {product.salePrice}</p>
//                 </div>
//                 <div className="product-stock">
//                     <p>Total Stock: {product.totalStock}</p>
//                 </div>
//                 <div className="product-actions">
//                     <button onClick={() => onEdit(product)}>Edit</button>
//                     <button onClick={() => onDelete(product)}>Delete</button>
//                 </div>
//             </div>
//         </div>
//     )

// }


export default AdminProductTile;