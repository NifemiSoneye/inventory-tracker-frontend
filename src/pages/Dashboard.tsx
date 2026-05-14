import React from "react";
import { useGetAnalyticsQuery } from "@/api/inventoryApi";
import { Button } from "@/components/ui/button";
import { type InventoryItem } from "@/lib/types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllItemsQuery, selectAllItems } from "@/api/inventoryApi";
import ItemTable from "./ItemTable";
import { LoaderCircle } from "lucide-react";

const Dashboard = () => {
  const { isLoading, isError } = useGetAllItemsQuery({});
  const items = useSelector(selectAllItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedItem(items.find((item) => item.id === id) ?? null);
    setIsDeleteOpen(true);
  };
  const { data: analytics } = useGetAnalyticsQuery(undefined);

  if (isLoading)
    return (
      <div className="fixed inset-0 z-50 bg-[#0B1628]">
        <div className="w-full h-dvh grid place-content-center">
          <LoaderCircle className="h-48 w-48 animate-spin text-white" />
        </div>
      </div>
    );

  if (isError)
    return <p className="text-red-500 p-4">Failed to load inventory.</p>;

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
      <ItemTable data={items} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Dashboard;
