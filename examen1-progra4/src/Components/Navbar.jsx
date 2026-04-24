import { Link } from '@tanstack/react-router';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link title="Ir al inicio" to="/" className="nav-logo">Car Parts</Link>
        <ul className="nav-links">
          <li>
            <Link to="/" activeProps={{ style: { fontWeight: 'bold', color: 'var(--accent-color)' } }}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/parts" activeProps={{ style: { fontWeight: 'bold', color: 'var(--accent-color)' } }}>
              Repuestos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;