function TruckDetail({ truck, onEdit, onArchive, isSaving, error }) {
  if (!truck) {
    return <p>Sélectionnez un camion pour voir son détail.</p>;
  }

  return (
    <aside className="detail">
      <h3>{truck.immatriculation}</h3>
      <p>{truck.marque} {truck.modele}</p>
      <p>Statut : {truck.statut}</p>
      <p>Kilométrage cumulé : {truck.kilometrageCumule}</p>
      <p>Dernière vidange : {truck.kilometrageDerniereVidange}</p>
      <p>Dernière révision : {truck.kilometrageDerniereRevision}</p>

      <button onClick={onEdit} disabled={isSaving}>Modifier</button>
      <button onClick={() => onArchive(truck)} disabled={isSaving}>Archiver</button>

      {error && <p className="error" role="alert">{error}</p>}
    </aside>
  );
}

export default TruckDetail;
