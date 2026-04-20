import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./components/Layout/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Simpan data di memori selama 5 menit.
      // data langsung muncul instan dari cache tanpa loading.
      staleTime: 1000 * 60 * 5,

      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </BrowserRouter>
      </QueryClientProvider>
      <Analytics />
    </>
  );
}

export default App;
