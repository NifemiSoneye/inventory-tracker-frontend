import { useSelector, useDispatch } from "react-redux";
import {
  selectSidebarOpen,
  toggleSidebar,
  closeSidebar,
} from "../../features/ui/uiSlice";

const SideBar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectSidebarOpen);
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

          <div className="flex items-center gap-3 text-sm font-semibold cursor-pointer py-[0.6rem] px-3 rounded-md transition-colors text-[#8A93A8] hover:text-white hover:bg-white/5">
            <span className="text-base w-5">▦</span>
            <p>Dashboard</p>
          </div>

          <div className="flex items-center gap-3 text-sm font-semibold cursor-pointer py-[0.6rem] px-3 rounded-md transition-colors text-[#8A93A8] hover:text-white hover:bg-white/5">
            <span className="text-base w-5">☰</span>
            <p>Inventory</p>
          </div>
        </section>
      </aside>
    </>
  );
};

export default SideBar;
