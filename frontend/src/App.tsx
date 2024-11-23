import AppRouter from './routes'
import { APIProvider } from '@vis.gl/react-google-maps'

const App = () => {
  console.log(import.meta.env)
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <AppRouter />
    </APIProvider>
  )
}

export default App
