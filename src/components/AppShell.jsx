function AppShell({ user, onLogout, children }) {
  return (
    <div className="shell">
      <header className="shell-header">
        <h1>FleetTrackPRO</h1>
        <div className="shell-user">
          <span>{user.nom} ({user.role})</span>
          <button onClick={onLogout}>Déconnexion</button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default AppShell;
