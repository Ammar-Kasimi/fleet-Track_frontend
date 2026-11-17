function DriverLayout({ user, children }) {
  return (
    <div className="layout">
      <nav className="menu" aria-label="Menu Chauffeur">
        <button className="active">Mes trajets</button>
      </nav>
      <section className="content">
        <h2>Bonjour {user.nom}</h2>
        {children}
      </section>
    </div>
  );
}

export default DriverLayout;
