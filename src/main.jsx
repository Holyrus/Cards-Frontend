import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  BrowserRouter as Router
} from 'react-router-dom'

import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
  </Router>
)
