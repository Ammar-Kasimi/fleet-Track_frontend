function TruckCard({ truck, isSelected, onSelect }) {
  return (
    <li>
      <button className={isSelected ? 'card selected' : 'card'} onClick={() => onSelect(truck._id)}>
        <strong>{truck.immatriculation}</strong>
        <span>{truck.marque} {truck.modele}</span>
        <span>{truck.statut}</span>
      </button>
    </li>
  );
}

export default TruckCard;
