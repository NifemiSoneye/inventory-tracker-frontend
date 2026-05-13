import Sidebar from "./Sidebar";
import DashNav from "./Nav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar />
      <main className="lg:ml-55 flex-1 p-8">
        <DashNav />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
