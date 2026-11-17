import { useState } from 'react';

const emptyTruck = {
  immatriculation: '',
  marque: '',
  modele: '',
  statut: 'DISPONIBLE',
  kilometrageCumule: 0,
  kilometrageDerniereVidange: 0,
  kilometrageDerniereRevision: 0
};

function TruckForm({ initialValues, onSubmit, onCancel, isSaving, error }) {
  const [values, setValues] = useState(initialValues || emptyTruck);
  const [fieldError, setFieldError] = useState('');

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (String(values.immatriculation).trim() === '' || String(values.marque).trim() === '' || String(values.modele).trim() === '') {
      setFieldError("L'immatriculation, la marque et le modèle sont obligatoires.");
      return;
    }

    const kmFields = ['kilometrageCumule', 'kilometrageDerniereVidange', 'kilometrageDerniereRevision'];
    for (const field of kmFields) {
      if (Number.isNaN(Number(values[field])) || Number(values[field]) < 0) {
        setFieldError('Les kilométrages doivent être des nombres positifs.');
        return;
      }
    }

    setFieldError('');
    await onSubmit({
      immatriculation: String(values.immatriculation).trim(),
      marque: String(values.marque).trim(),
      modele: String(values.modele).trim(),
      statut: values.statut,
      kilometrageCumule: Number(values.kilometrageCumule),
      kilometrageDerniereVidange: Number(values.kilometrageDerniereVidange),
      kilometrageDerniereRevision: Number(values.kilometrageDerniereRevision)
    });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <h3>{initialValues ? 'Modifier le camion' : 'Nouveau camion'}</h3>

      <label htmlFor="truck-immat">Immatriculation</label>
      <input id="truck-immat" name="immatriculation" value={values.immatriculation} onChange={handleChange} />

      <label htmlFor="truck-marque">Marque</label>
      <input id="truck-marque" name="marque" value={values.marque} onChange={handleChange} />

      <label htmlFor="truck-modele">Modèle</label>
      <input id="truck-modele" name="modele" value={values.modele} onChange={handleChange} />

      <label htmlFor="truck-statut">Statut</label>
      <select id="truck-statut" name="statut" value={values.statut} onChange={handleChange}>
        <option value="DISPONIBLE">Disponible</option>
        <option value="EN_MAINTENANCE">En maintenance</option>
      </select>

      <label htmlFor="truck-km">Kilométrage cumulé</label>
      <input id="truck-km" name="kilometrageCumule" type="number" min="0" value={values.kilometrageCumule} onChange={handleChange} />

      <label htmlFor="truck-vidange">Kilométrage dernière vidange</label>
      <input id="truck-vidange" name="kilometrageDerniereVidange" type="number" min="0" value={values.kilometrageDerniereVidange} onChange={handleChange} />

      <label htmlFor="truck-revision">Kilométrage dernière révision</label>
      <input id="truck-revision" name="kilometrageDerniereRevision" type="number" min="0" value={values.kilometrageDerniereRevision} onChange={handleChange} />

      {fieldError && <p className="error" role="alert">{fieldError}</p>}
      {error && <p className="error" role="alert">{error}</p>}

      <button type="submit" disabled={isSaving}>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</button>
      <button type="button" onClick={onCancel} disabled={isSaving}>Annuler</button>
    </form>
  );
}

export default TruckForm;
