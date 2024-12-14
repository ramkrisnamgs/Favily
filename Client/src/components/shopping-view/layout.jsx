import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">  
        <Outlet />  
      </main>
    </div>
  );
}

export default ShoppingLayout;

//what do the <Outlet /> do? => 

// why my outlet is not working? => 