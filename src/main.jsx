import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  BrowserRouter as Router
} from 'react-router-dom'

import App from './App'
import './index.css'

import { ErrorNotificationContextProvider } from './components/ErrorNotificationContext'
import { NotificationContextProvider } from './components/NoificationContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <ErrorNotificationContextProvider>
      <NotificationContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </NotificationContextProvider>
    </ErrorNotificationContextProvider>
  </Router>
)
