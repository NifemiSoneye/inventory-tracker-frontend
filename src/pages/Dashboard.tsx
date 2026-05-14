import React from "react";
import { useGetAnalyticsQuery } from "@/api/inventoryApi";
import { Button } from "@/components/ui/button";
import { type InventoryItem } from "@/lib/types";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetAllItemsQuery, selectAllItems } from "@/api/inventoryApi";
import ItemTable from "./ItemTable";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUpdateItemMutation } from "@/api/inventoryApi";
import { useCreateItemMutation } from "@/api/inventoryApi";
import { useDeleteItemMutation } from "@/api/inventoryApi";
import { DebouncedInput } from "@/components/DebouncedInput";
const Dashboard = () => {
  const [search, setSearch] = useState("");
  const { isLoading, isError } = useGetAllItemsQuery({
    search: search || undefined,
  });
  const [updateItem, { isLoading: isUpdateLoading }] = useUpdateItemMutation();
  const [createItem, { isLoading: isCreateLoading }] = useCreateItemMutation();
  const [deleteItem, { isLoading: isDeleteLoading }] = useDeleteItemMutation();
  const items = useSelector(selectAllItems);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [modalErrMsg, setModalErrMsg] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const modalErrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const formatWithCommas = (value: string): string => {
    if (!value) return "";
    return parseFloat(value).toLocaleString("en-US");
  };

  const handleAmountChange = (input: string) => {
    const rawValue = input.replace(/,/g, ""); // remove commas
    if (!isNaN(Number(rawValue))) {
      setQuantity(rawValue); // store as raw number
    }
  };
  const handlePriceChange = (input: string) => {
    const rawValue = input.replace(/,/g, ""); // remove commas
    if (!isNaN(Number(rawValue))) {
      setPrice(rawValue); // store as raw number
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setIsModalOpen(true);
    setSelectedItem(item);
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity.toString());
    setPrice(item.price.toString());
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalErrMsg("");
    setName("");
    setCategory("");
    setQuantity("");
    setPrice("");
  };

  const handleUpdate = async () => {
    if (!selectedItem?.id) return;
    try {
      const response = await updateItem({
        id: selectedItem?.id,
        name,
        quantity: Number(quantity),
        category,
        price: Number(price),
      }).unwrap();
      toast({
        variant: "default",
        title: "Success! 🎉",
        description: response.message,
      });
      handleClose();
    } catch (err: any) {
      if (!err.status) {
        setModalErrMsg("No Server Response");
      } else if (err.status === 400) {
        setModalErrMsg("All fields are required");
      } else if (err.status === 409) {
        setModalErrMsg("Duplicate Title");
      } else {
        setModalErrMsg(err.data?.message);
      }
      modalErrRef?.current?.focus();
    }
  };
  const handleCreate = async () => {
    try {
      const response = await createItem({
        name,
        quantity: Number(quantity),
        category,
        price: Number(price),
      }).unwrap();
      toast({
        variant: "default",
        title: "Success! 🎉",
        description: response.message,
      });
      handleClose();
    } catch (err: any) {
      if (!err.status) {
        setModalErrMsg("No Server Response");
      } else if (err.status === 400) {
        setModalErrMsg("All fields are required");
      } else if (err.status === 409) {
        setModalErrMsg("Duplicate Title");
      } else {
        setModalErrMsg(err.data?.message);
      }
      modalErrRef?.current?.focus();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteItem(id).unwrap();
      toast({
        variant: "default",
        title: "Success! 🎉",
        description: response,
      });
    } catch (err: any) {
      if (!err.status) {
        setModalErrMsg("No Server Response");
      } else if (err.status === 400) {
        setModalErrMsg("ItemID required");
      } else if (err.status === 404) {
        setModalErrMsg("Item not found");
      } else {
        setModalErrMsg(err.data?.message);
      }
    }
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
          onClick={() => setIsModalOpen(true)}
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

      <ItemTable
        data={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deleteLoading={isDeleteLoading}
      />

      {isModalOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />

          {/* modal - bottom sheet on mobile, centered on desktop */}
          <div
            className="fixed z-50
                        bottom-0 left-0 right-0 rounded-t-2xl
                        md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:w-105
                        bg-[#1C1C1C]  p-6 animate-in slide-in-from-bottom md:slide-in-from-bottom-0 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={
                modalErrMsg
                  ? "bg-red-200 px-4 py-2 my-2 rounded-lg  text-red-500"
                  : "hidden"
              }
              ref={modalErrRef}
            >
              🚨 {modalErrMsg}
            </div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-['Playfair_Display_Variable'] font-semibold text-lg">
                {selectedItem ? selectedItem?.name : "New Item"}
              </h2>
            </div>
            <Label
              htmlFor="Title"
              className="text-[#8A93A8] text-xs uppercase tracking-wider mb-2 block"
            >
              Title
            </Label>
            <Input
              className={`w-full mb-3 rounded-sm text-white  bg-[#FFFFFF0D] p-[0.6rem] text-sm focus:outline-none font-sans`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Label
              htmlFor="Description"
              className="text-[#8A93A8] text-xs uppercase tracking-wider mb-2 block"
            >
              Category
            </Label>

            <Input
              className={`w-full mt-3 rounded-sm text-white  bg-[#FFFFFF0D] p-[0.6rem] text-sm focus:outline-none font-sans`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Label
              htmlFor="Status"
              className="text-[#8A93A8] text-xs uppercase tracking-wider my-4 block"
            >
              Quantity
            </Label>

            <Input
              className={`w-full mt-3 rounded-sm text-white  bg-[#FFFFFF0D] p-[0.6rem] text-sm focus:outline-none font-sans`}
              value={formatWithCommas(quantity)}
              onChange={(e) => handleAmountChange(e.target.value)}
            />

            <Label
              htmlFor="Description"
              className="text-[#8A93A8] text-xs uppercase tracking-wider my-4 block"
            >
              Price
            </Label>
            <Input
              className={`w-full mt-3 rounded-sm text-white  bg-[#FFFFFF0D] p-[0.6rem] text-sm focus:outline-none font-sans`}
              value={formatWithCommas(price)}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
            <div className="flex gap-3 mt-5 border-t border-t-[#292c33] pt-5">
              <Button
                type="button"
                variant="default"
                title="Cancel"
                className="flex-1 border border-white/10 text-[#8A93A8] rounded-md py-2 text-sm"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
              {selectedItem ? (
                <Button
                  type="button"
                  variant="default"
                  title="Create new board"
                  className="flex-1 bg-[#2f1340] font-semibold border border-white/10 text-white rounded-md py-2 text-sm"
                  onClick={handleUpdate}
                >
                  {isUpdateLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Update Item"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="default"
                  title="Create new board"
                  className="flex-1 bg-[#2f1340] font-semibold border border-white/10 text-white rounded-md py-2 text-sm"
                  onClick={handleCreate}
                >
                  {isCreateLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Create Item"
                  )}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
