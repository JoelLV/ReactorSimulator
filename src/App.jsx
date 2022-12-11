import Dashboard from "./components/Dashboard"
import ReactorView from "./components/ReactorView"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import './App.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />
    },
    {
        path: '/:id',
        element: <ReactorView />
    }
])

const App = () => {
    return (
        <div>
            <RouterProvider router={router} />
        </div>


    )
}

export default App