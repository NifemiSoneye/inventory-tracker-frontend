import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../features/ui/uiSlice";
const DashNav = () => {
  // dispatch actions
  const dispatch = useDispatch();

  const flipSideBar = () => {
    dispatch(toggleSidebar());
  };
  const menuIcon = new URL("../../assets/icon-hamburger.svg", import.meta.url)
    .href;
  return (
    <div className="bg-[#2f1340]  flex justify-between py-2 px-3 border-b border-b-[#292c33] lg:hidden">
      <div className="flex items-center">
        <Button
          type="button"
          variant="default"
          title="Sidebar"
          className="bg-transparent lg:hidden"
          onClick={flipSideBar}
        >
          <img
            src={menuIcon}
            alt="hamburger icon"
            className="cursor-pointer h-4 w-4"
          />
        </Button>
        <div className="p-6">
          <p className="text-white text-2xl font-['Playfair_Display_Variable']">
            <span className="text-[#C9A84C]">Stock</span>Wise
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashNav;
