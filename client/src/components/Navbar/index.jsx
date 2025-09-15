import { Link } from "react-router-dom"
import './index.css'

const Navbar = () => {
    const handleLogout = () => {
        localStorage.removeItem('Quizz-Pro')
        window.location.href='/login'

    }
    return (
        <nav>
            <h2><Link to='/' className="link">Quizz Pro</Link></h2>
            <section className="nav-link-items">
                <Link to='/' className="link">Home</Link>
                <Link to='/results' className="link">Recent Quizz</Link>
            </section>
            <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
    )
}

export default Navbar