import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const dispatch = useDispatch(); // Redux dispatch function
  const [rating, setRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState("");
  const { user } = useSelector((state) => state.auth); // Get user from Redux state
  const { cartItems } = useSelector((state) => state.shopCart); // Get cart items from Redux state
  const { reviews } = useSelector((state) => state.shopReview); // Get reviews from Redux state
  const { toast } = useToast(); // Toast notification function

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  /**
   * Handles adding the product to the cart.
   *
   * @param {string} getCurrentProductId - The ID of the current product.
   */
  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log("product Details", productDetails); // Log product details
    console.log("getCurrentProductId", getCurrentProductId); // Log current product ID
    console.log("user ID", user?.id); // Log user ID

    let getCartItems = cartItems.items || []; // Get cart items from state

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      ); // Find index of current product in cart items

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity; // Get quantity of current product in cart items
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`, // Notify user of stock limit
            variant: "destructive", // Set variant to destructive
          });
          return; // Exit function
        }
      }
    }

    // Dispatch addToCart action with user ID, product ID, and quantity
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      // If the addition is successful, fetch updated cart items and show a toast
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  // Function to handle dialog close
  function handleDialogClose() {
    setOpen(false); // Close the dialog
    dispatch(setProductDetails()); // Clear product details
    setRating(0); // Reset rating
    setReviewMsg(""); // Reset review message
  }

  // Function to handle adding a review
  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image} // Product image
            alt={productDetails?.title} // Alt text for the image
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>{" "}
            {/* Product title */}
            <p className="text-muted-foreground text-2xl mb-4">
              {productDetails?.description} {/* Product description */}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ₹{productDetails?.price} {/* Original price */}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ₹{productDetails?.salePrice} {/* Sale price if applicable */}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {/* Star rating display */}
              <StarRatingComponent rating={averageReview}/>
            </div>
            <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>{" "}
            {/* Review count */}
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddtoCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                } // Add to cart button
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mt-2 mb-4">Reviews</h2>
            <div className="grid gap-6 mb-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => {
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        <span>{reviewItem?.userName[0].toUpperCase()}</span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>;
                })
              ) : (
                <h2>No reviews yet</h2>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog; // Exporting the ProductDetailsDialog component
