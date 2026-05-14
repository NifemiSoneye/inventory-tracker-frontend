import { useSelector, useDispatch } from "react-redux";
import { selectSidebarOpen, closeSidebar } from "../../features/ui/uiSlice";
import { useGetAllItemsQuery } from "@/api/inventoryApi";
import { type InventoryItem } from "@/lib/types";
const SideBar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectSidebarOpen);
  const { data: itemsData } = useGetAllItemsQuery(undefined);
  const items = itemsData
    ? (Object.values(itemsData.entities).filter(Boolean) as InventoryItem[])
    : [];
  const recentItems = items.slice(-4).reverse();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => dispatch(closeSidebar())}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-full w-55 bg-[#2f1340] z-50 transition-transform duration-300 min-h-screen flex flex-col overflow-hidden  ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-auto lg:sticky lg:top-0 lg:h-screen
        `}
      >
        <div className="p-6 border-b border-b-[#3a1f50]">
          <p className="text-white text-2xl font-['Playfair_Display_Variable']">
            <span className="text-[#C9A84C]">Stock</span>Wise
          </p>
        </div>

        <section className="p-6 flex flex-col gap-1">
          <p className="uppercase text-xs text-[#8A93A8] font-semibold mb-3">
            Menu
          </p>

          <div className="flex items-center gap-3 text-sm font-semibold cursor-pointer py-[0.6rem] px-3 rounded-md transition-colors bg-[#C9A84C1A] text-[#C9A84C]">
            <span className="text-base w-5">▦</span>
            <p>Dashboard</p>
          </div>
        </section>
        <div className="px-4 py-4 border-t border-t-[#3a1f50]">
          <p className="text-xs text-[rgba(255,255,255,0.3)] uppercase tracking-widest mb-3">
            Recent items
          </p>
          {recentItems.length === 0 ? (
            <p className="text-xs text-[rgba(255,255,255,0.3)]">No items yet</p>
          ) : (
            recentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-3"
              >
                <p className="text-xs text-white truncate flex-1 mr-2">
                  {item.name}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    item.status === "In stock"
                      ? "bg-green-100 text-green-800"
                      : item.status === "Low stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status === "In stock"
                    ? "In"
                    : item.status === "Low stock"
                      ? "Low"
                      : "Out"}
                </span>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
