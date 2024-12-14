import { Navigate, useLocation } from "react-router-dom";




function CheckAuth({ isAuthenticated, user, children }) {

    const location = useLocation();

    if (location.pathname === "/") {
        if (!isAuthenticated) {
          return <Navigate to="/auth/login" />;
        } else {
          if (user?.role === "admin") {
            return <Navigate to="/admin/dashboard" />;
          } else {
            return <Navigate to="/shop/home" />;
          }
        }
      }

    // if user is not authenticated and not accessing login and register pages, redirect to login page
    if (!isAuthenticated && !(location.pathname.includes("/login") || location.pathname.includes("/register"))) {
        return <Navigate to="/auth/login" />
    }


    // admin and shopping user can't access login and register pages
    if (isAuthenticated && (location.pathname.includes("/login") || location.pathname.includes("/register"))) {
        if (user?.role === "admin") {
            return <Navigate to="/admin/dashboard" />
        } else {
            return <Navigate to="/shopping/home" />
        }
    }


    // shopping user can't access admin pages
    if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("/admin")) {
        return <Navigate to="/unauth-page" />
    }

    // admin user can't access shopping pages
    if (isAuthenticated && user?.role === "admin" && (location.pathname.includes("/shopping"))) {
        return <Navigate to="/admin/dashboard" />
    }

    // if user is not authenticated and accessing unauth page, redirect to login page
    if (!isAuthenticated && location.pathname.includes("/unauth-page")) {
        return <Navigate to="/auth/login" />
    }

    // if user is authenticated and accessing unauth page, redirect to home page
    if (isAuthenticated && location.pathname.includes("/unauth-page")) {
        return <Navigate to="/" />
    }

    // return the children components
    return <>{children}</>;

}

export default CheckAuth;