function UserDetail({ user, onChangeStatus, isSaving, error }) {
  if (!user) {
    return <p>Sélectionnez un utilisateur pour voir son détail.</p>;
  }

  return (
    <aside className="detail">
      <h3>{user.nom}</h3>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>
      <p>Statut : {user.statutCompte}</p>

      {user.role === 'CHAUFFEUR' && (
        <button onClick={() => onChangeStatus(user)} disabled={isSaving}>
          {user.statutCompte === 'ACTIF' ? 'Suspendre' : 'Réactiver'}
        </button>
      )}

      {error && <p className="error" role="alert">{error}</p>}
    </aside>
  );
}

export default UserDetail;
