function ProtectedView({ user, allowedRoles, children }) {
  if (!user) {
    return <p className="error" role="alert">Connexion requise.</p>;
  }
  if (!allowedRoles.includes(user.role)) {
    return <p className="error" role="alert">Accès refusé.</p>;
  }
  return children;
}

export default ProtectedView;
