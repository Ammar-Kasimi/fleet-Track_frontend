import UserCard from './UserCard';

function UserList({
  users, selectedId, onSelect, isLoading, error,
  roleFilter, statusFilter, onRoleFilterChange, onStatusFilterChange
}) {
  return (
    <div>
      <div className="filters">
        <label htmlFor="role-filter">Rôle</label>
        <select id="role-filter" value={roleFilter} onChange={(e) => onRoleFilterChange(e.target.value)}>
          <option value="ALL">Tous</option>
          <option value="ADMIN">Admin</option>
          <option value="CHAUFFEUR">Chauffeur</option>
        </select>

        <label htmlFor="status-filter">Statut</label>
        <select id="status-filter" value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
          <option value="ALL">Tous</option>
          <option value="ACTIF">Actif</option>
          <option value="SUSPENDU">Suspendu</option>
        </select>
      </div>

      {isLoading && <p>Chargement...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!isLoading && !error && users.length === 0 && <p>Aucun utilisateur à afficher.</p>}

      <ul className="cards">
        {users.map((user) => (
          <UserCard key={user._id} user={user} isSelected={user._id === selectedId} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  );
}

export default UserList;
