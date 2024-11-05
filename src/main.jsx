import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'

const BASE_URL = 'https://beo.mzgb.net/api/rating?page=rating-music&limit=200';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKey: ['repoData'],
      queryFn: () => axios(`${ BASE_URL }`)
        .then((res) => res.data.rating)
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  </StrictMode>,
)
