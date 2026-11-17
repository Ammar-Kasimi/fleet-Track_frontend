function TripList({ trips, isLoading, error }) {
  if (isLoading) {
    return <p>Chargement des trajets...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (trips.length === 0) {
    return <p>Aucun trajet pour le moment.</p>
  }

  const items = []
  for (const trip of trips) {
    items.push(
      <li key={trip._id}>
        <strong>{trip.siteDepart} → {trip.siteArrivee}</strong>
        <p>Marchandise : {trip.marchandise}</p>
        <p>Début prévu : {new Date(trip.dateDebutPrevue).toLocaleDateString('fr-FR')}</p>
        <p>Fin prévue : {new Date(trip.dateFinPrevue).toLocaleDateString('fr-FR')}</p>
        <p>Statut : {trip.statut}</p>
      </li>
    )
  }

  return <ul>{items}</ul>
}

export default TripList