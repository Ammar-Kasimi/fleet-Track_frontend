import TruckCard from './TruckCard';

function TruckList({ trucks, selectedId, onSelect, isLoading, error, statusFilter, onStatusFilterChange }) {
  return (
    <div>
      <div className="filters">
        <label htmlFor="truck-status-filter">Statut</label>
        <select id="truck-status-filter" value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)}>
          <option value="ALL">Tous</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="EN_MAINTENANCE">En maintenance</option>
        </select>
      </div>

      {isLoading && <p>Chargement...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!isLoading && !error && trucks.length === 0 && <p>Aucun camion à afficher.</p>}

      <ul className="cards">
        {trucks.map((truck) => (
          <TruckCard key={truck._id} truck={truck} isSelected={truck._id === selectedId} onSelect={onSelect} />
        ))}
      </ul>
    </div>
  );
}

export default TruckList;
