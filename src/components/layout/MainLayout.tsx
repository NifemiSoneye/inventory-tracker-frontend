import Sidebar from "./Sidebar";
import DashNav from "./Nav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar />
      <main className=" flex-1 flex flex-col overflow-x-hidden">
        <DashNav />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
