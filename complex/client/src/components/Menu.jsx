import { Link } from "react-router-dom";
const Menu = () => {
    return <>
        <ul>
            <Link to="/"><li>home</li></Link>
            <Link to="/other"><li>Other</li></Link>
        </ul>
    </>
}

export default Menu;