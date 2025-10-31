import DashboardClient from "@/components/DashboardClient";
import { getDashboardServerData } from "@/lib/data";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard aplikasi inventory",
};

const DashboardPage = async () => {
  let data = null;
  let error = null;

  try {
    data = await getDashboardServerData();
  } catch (error) {
    console.error("gagal mengambil data dashboard", error);
    error = "Terjadi kesalahan, coba lagi nanti!";
  }
  return <DashboardClient initialData={data} error={error} />;
};

export default DashboardPage;
