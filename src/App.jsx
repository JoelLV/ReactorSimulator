import Dashboard from "./components/Dashboard"
import ReactorView from "./components/ReactorView"
import Navbar from "./components/Navbar"
import NameForm from "./components/NameForm"
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
            <Navbar />
            <div>
                <h1 id="powerName">Enter Power Plant Name</h1>
                <NameForm />
            </div>

            <RouterProvider router={router} />
        </div>


    )
}

export default App