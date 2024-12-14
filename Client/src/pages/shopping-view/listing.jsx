// Client/src/pages/shopping-view/listing.jsx

import ProductFilter from "@/components/shopping-view/filter"; // Importing the ProductFilter component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Importing dropdown menu components
import { Button } from "@/components/ui/button"; // Importing Button component
import { sortOptions } from "@/config"; // Importing sorting options from configuration
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice"; // Importing Redux actions for fetching products
import { useEffect, useState } from "react"; // Importing React hooks
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import ShoppingProductTile from "@/components/shopping-view/product-tile"; // Importing the ShoppingProductTile component
import ProductDetailsDialog from "@/components/shopping-view/product-details"; // Importing the ProductDetailsDialog component
import { ArrowUpDownIcon } from "lucide-react"; // Importing icon for sorting
import { useSearchParams } from "react-router-dom"; // Importing hook for managing search parameters
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"; // Importing cart actions
import { useToast } from "@/hooks/use-toast"; // Importing toast notification hook

/**
 ** createSearchParamsHelper Function
 * 
 * Helper function to create query parameters from filter options.
 * 
 * @param {object} filterParams - The filter parameters to convert to query string.
 * @returns {string} - The formatted query string.
 */
function createSearchParamsHelper(filterParams) {
  const queryParams = []; // Array to hold query parameters
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(","); // Join array values into a string
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`); // Encode and push to queryParams
    }
  }
  return queryParams.join("&"); // Return the joined query string
}

/**
 ** ShoppingListing Component
 * 
 * Displays a list of products with filtering and sorting options.
 */
function ShoppingListing() {
  const dispatch = useDispatch(); // Redux dispatch function
  const { productList, productDetails, isLoading, error } = useSelector(
    (state) => state.shoppingProducts // Selecting product data from Redux state
  );
  const { cartItems } = useSelector((state) => state.shopCart); // Selecting cart items from Redux state
  const [sort, setSort] = useState(null); // State for sorting option
  const [filters, setFilters] = useState({}); // State for filter options
  const [searchParams, setSearchParams] = useSearchParams(); // Hook for managing search parameters
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false); // State for dialog visibility
  const { user } = useSelector((state) => state.auth); // Get user from Redux state
  const { toast } = useToast(); // Toast notification function

  const categorySearchParam = searchParams.get("Category"); // Get category search parameter


  /**
   ** handleSort Function
   * 
   * Updates the sorting option.
   * 
   * @param {string} value - The selected sorting value.
   */
  function handleSort(value) {
    setSort(value); // Update sort state
  }

  /**
   ** handleGetProductDetails Function
   * 
   * Fetches details for the selected product.
   * 
   * @param {string} getCurrentProductId - The ID of the current product.
   */
  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId); // Log te current product ID
    dispatch(fetchProductDetails(getCurrentProductId)); // Dispatch action to fetch product details
    // setOpenDetailsDialog(true); // Uncomment to open details dialog
  }
  
  /**
   * handleAddtoCart Function
   * 
   * Adds the selected product to the cart.
   * 
   * @param {string} getCurrentProductId - The ID of the current product.
   */
  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log("getCurrentProductId", getCurrentProductId); // Log the current product ID
    console.log("user ID", user?.id); // Log user ID
    console.log(cartItems, "cartItem"); // Log cart items
    

    let getCartItems = cartItems.items || []; // Get cart items from state

    if(getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductId); // Find index of current product in cart items

      if(indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity; // Get quantity of current product in cart items
        if(getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`, // Notify user of stock limit
            variant: 'destructive', // Set variant to destructive
          })
          return; // Exit function
        }
      }
    }
    
    dispatch(
      addToCart({
        userId: user?.id, // User ID from state
        productId: getCurrentProductId, // Current product ID
        quantity: 1, // Default quantity
      })
    ).then((data) => {
      if (data?.payload?.success) { // Check if the addition was successful
        dispatch(fetchCartItems(user?.id)); // Fetch updated cart items
        toast({
          title: "Product is added to cart", // Notify user of success
        });
      } else {
        toast({
          title: "Product is not added to cart", // Notify user of failure
          description: data, // Include error data
        });
      }
    });
  }

  /**
   * handleFilter Function
   * 
   * Updates the selected filters based on user input.
   * 
   * @param {string} getSectionId - The ID of the filter section.
   * @param {string} getCurrentOption - The selected filter option.
   */
  function handleFilter(getSectionId, getCurrentOption) {
    console.log(getSectionId, getCurrentOption, "getSectionId, getCurrentOption"); // Log filter details

    let copyFilters = { ...filters }; // Create a copy of current filters
    const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId); // Find index of current section

    if (indexOfCurrentSection === -1) {
      // If section doesn't exist, add it
      copyFilters = {
        ...copyFilters,
        [getSectionId]: [getCurrentOption], // Initialize with the selected option
      };
    } else {
      const indexOfCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOption); // Find index of current option

      if (indexOfCurrentOption === -1) {
        // If option doesn't exist, add it
        copyFilters[getSectionId].push(getCurrentOption);
      } else {
        // If option exists, remove it
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    console.log(copyFilters, "copyFilters"); // Log updated filters

    setFilters(copyFilters); // Update filters state
    sessionStorage.setItem("filters", JSON.stringify(copyFilters)); // Store filters in session storage
  }

  // Effect to set initial sort and filters from session storage
  useEffect(() => {
    setSort("price-lowtohigh"); // Set default sort option
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {}); // Load filters from session storage
  }, [categorySearchParam]);

  // Effect to update search parameters based on filters
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters); // Create query string from filters
      setSearchParams(new URLSearchParams(createQueryString)); // Update search parameters
    }
  }, [filters]);

  // Effect to fetch list of products based on filters and sort
  useEffect(() => {
    console.log("Current Filters:", filters); // Log current filters
    console.log("Product List:", productList); // Log current product list
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }) // Fetch filtered products
      );
    }
  }, [dispatch, filters, sort]);

  // Effect to open product details dialog when product details are available
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true); // Open details dialog
    }
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} /> {/* Render product filter */}
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Products</h2> {/* Title for product list */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products {/* Display number of products */}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" /> {/* Sort icon */}
                  <span>Sort by</span> {/* Sort button label */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label} {/* Display sort options */}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id} // Unique key for each product
                product={productItem} // Product data
                handleGetProductDetails={handleGetProductDetails} // Function to get product details
                handleAddtoCart={handleAddtoCart} // Function to add product to cart
              />
            ))
          ) : (
            <p>No products available.</p> // Message when no products are found
          )}
        </div>
      </div>
      <ProductDetailsDialog // ProductDetailsDialog component for displaying product details
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddtoCart={handleAddtoCart}
      />
    </div>
  );
}

export default ShoppingListing; // Exporting the ShoppingListing component