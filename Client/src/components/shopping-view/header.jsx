// Client/src/components/shopping-view/header.jsx

import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react"; // Importing icons from lucide-react
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom"; // Importing routing hooks
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"; // Importing Sheet components for modal functionality
import { Button } from "../ui/button"; // Importing Button component
import { useDispatch, useSelector } from "react-redux"; // Importing Redux hooks
import { shoppingViewHeaderMenuItems } from "@/config"; // Importing menu items configuration
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"; // Importing Dropdown Menu components
import { Avatar, AvatarFallback } from "../ui/avatar"; // Importing Avatar components
import { logoutUser } from "@/store/auth-slice"; // Importing logout action from Redux slice
import UserCartWrapper from "./cart-wrapper"; // Importing UserCartWrapper component
import { useEffect, useState } from "react"; // Importing React hooks
import { fetchCartItems } from "@/store/shop/cart-slice"; // Importing action to fetch cart items
import { Label } from "../ui/label"; // Importing Label component
import { fetchAllFilteredProducts } from "@/store/shop/products-slice"; // Import the action to fetch filtered products

/**
 **MenuItems Function**
 *
 * Renders the navigation menu items for the shopping view.
 */
function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            Category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?Category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

/**
 **HeaderRightContent Function**
 *
 * Renders the right side content of the header, including user avatar, cart, and logout functionality.
 */
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth); // Get user from Redux state
  const { cartItems } = useSelector((state) => state.shopCart); // Get cart items from Redux state
  const [openCartSheet, setOpenCartSheet] = useState(false); // State for cart sheet visibility
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch(); // Redux dispatch function

  /**
   **handleLogout Function**
   *
   * Handles user logout by dispatching the logout action.
   */
  function handleLogout() {
    dispatch(logoutUser()); // Dispatch logout action
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id)); // Fetch cart items when user ID changes
  }, [dispatch, user?.id]);

  /**
   **getInitials Function**
   *
   * Returns the initials of the user's name for display in the avatar.
   *
   * @param {string} name - The user's name.
   * @returns {string} - The initials of the user's name.
   */
  function getInitials(name) {
    if (!name) return "U"; // Default to "U" if no name
    const nameParts = name.split(" "); // Split name into parts
    return nameParts.map((part) => part[0].toUpperCase()).join(""); // Return initials
  }

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        {" "}
        {/* Cart sheet for displaying cart items */}
        <Button
          onClick={() => setOpenCartSheet(true)} // Open cart sheet on button click
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" /> {/* Shopping cart icon */}
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}{" "}
            {/* Display number of items in cart */}
          </span>
          <span className="sr-only">User cart</span>{" "}
          {/* Screen reader only text */}
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet} // Function to close cart sheet
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : [] // Pass cart items to UserCartWrapper
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {getInitials(user?.userName) || "U"} {/* Display user initials */}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          className="w-56 m-4 bg-opacity-100 bg-white shadow-lg rounded-xl p-2"
        >
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>{" "}
          {/* Display logged in user */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate("/shopping/account")} // Navigate to account page
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account {/* Account menu item */}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            {" "}
            {/* Logout menu item */}
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 **ShoppingHeader Function**
 *
 * Renders the main header for the shopping view, including the logo, navigation, and user options.
 */
function ShoppingHeader() {
  const { user, isAuthenticate } = useSelector((state) => state.auth); // Get user and authentication status from Redux state

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {" "}
      {/* Header container */}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          to="/shopping/home"
          className="flex items-center gap-2 text-rose-600"
        >
          <img src="/favily.webp" alt="Favily" className="h-12 w-12" />{" "}
          {/* Logo image */}
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" /> {/* Menu icon for mobile */}
              <span className="sr-only">Toggle header menu</span>{" "}
              {/* Screen reader only text */}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems /> {/* Render menu items */}
            <HeaderRightContent /> {/* Render right content of the header */}
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems /> {/* Render menu items for larger screens */}
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />{" "}
          {/* Render right content of the header for larger screens */}
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader; // Exporting the ShoppingHeader component
