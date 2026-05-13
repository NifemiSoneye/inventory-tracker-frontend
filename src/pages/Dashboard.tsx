import React from "react";
import { useGetAnalyticsQuery } from "@/api/inventoryApi";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: analytics } = useGetAnalyticsQuery(undefined);
  return (
    <div className="bg-black min-h-screen p-4">
      <section className=" items-center justify-between p-4 hidden lg:flex">
        <div className="text-white">
          <p>DashBoard</p>
          <p>Manage your inventory</p>
        </div>
        <Button
          variant="default"
          title="Add item"
          className="bg-transparent p-5 border border-gray-400 text-lg"
        >
          + Add Item
        </Button>
      </section>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-[#303030] py-4 pl-4 border border-transparent rounded-xl">
          <p className="text-gray-400 text-lg">Total Products</p>
          <p className="font-semibold text-2xl text-white">
            {analytics?.totalProductCount}
          </p>
          <p>
            across {analytics?.uniqueCategoryCount}{" "}
            {analytics?.uniqueCategoryCount > 1 ? "categories" : "category"}
          </p>
        </div>

        <div className="bg-[#303030] py-4 pl-4 border border-transparent rounded-xl">
          <p className="text-gray-400 text-lg">Low stock</p>
          <p className="font-semibold text-2xl text-yellow-400">
            {analytics?.lowStockCount}
          </p>
          <p>need restocking</p>
        </div>

        <div className="bg-[#303030] py-4 pl-4 pr-4 border border-transparent rounded-xl col-span-2 lg:col-span-1">
          <p className="text-gray-400 text-lg">Out of stock</p>
          <p className="font-semibold text-2xl text-red-600">
            {analytics?.noStockCount}
          </p>
          <p>unavailable</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
