import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import MainLayout from './components/Layout/MainLayout';
import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Simpan data di memori selama 5 menit.
      // Jadi pas di-back, data langsung muncul instan dari cache tanpa loading.
      staleTime: 1000 * 60 * 5, 
      
      // (Opsional) Biar pas kamu pindah tab browser, datanya gak tiba-tiba loading ulang
      refetchOnWindowFocus: false, 
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      
        <MainLayout>
           <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;