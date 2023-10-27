import { Outlet } from "react-router-dom";
import Menu from "./components/Menu";

const Dashboard = () => {
    return <>
        <Menu />
        <h2>Fibonacci series calculate</h2>
        <div>
            <Outlet />
        </div>
    </>
}

export default Dashboard;