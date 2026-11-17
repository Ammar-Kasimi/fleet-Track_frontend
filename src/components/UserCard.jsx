function UserCard({ user, isSelected, onSelect }) {
  return (
    <li>
      <button className={isSelected ? 'card selected' : 'card'} onClick={() => onSelect(user._id)}>
        <strong>{user.nom}</strong>
        <span>{user.email}</span>
        <span>{user.role} - {user.statutCompte}</span>
      </button>
    </li>
  );
}

export default UserCard;
