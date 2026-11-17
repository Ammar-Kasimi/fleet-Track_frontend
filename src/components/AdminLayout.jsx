function AdminLayout({ activeView, onNavigate, children }) {
  return (
    <div className="layout">
      <nav className="menu" aria-label="Menu Admin">
        <button className={activeView === 'users' ? 'active' : ''} onClick={() => onNavigate('users')}>
          Utilisateurs
        </button>
        <button className={activeView === 'trucks' ? 'active' : ''} onClick={() => onNavigate('trucks')}>
          Camions
        </button>
      </nav>
      <section className="content">{children}</section>
    </div>
  );
}

export default AdminLayout;
