import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/toaster";
const App = () => {
  return (
    <>
      <MainLayout>
        <Dashboard />
      </MainLayout>
      <Toaster />
    </>
  );
};

export default App;
