import { useState } from 'react';

function UserForm({ onSubmit, isSaving, error }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [fieldError, setFieldError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (nom.trim() === '' || email.trim() === '' || motDePasse === '') {
      setFieldError('Tous les champs sont obligatoires.');
      return;
    }
    setFieldError('');
    const success = await onSubmit(nom.trim(), email.trim(), motDePasse);
    if (success) {
      setNom('');
      setEmail('');
      setMotDePasse('');
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <h3>Créer un chauffeur</h3>

      <label htmlFor="new-nom">Nom</label>
      <input id="new-nom" value={nom} onChange={(e) => setNom(e.target.value)} />

      <label htmlFor="new-email">Email</label>
      <input id="new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label htmlFor="new-password">Mot de passe</label>
      <input id="new-password" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} />

      {fieldError && <p className="error" role="alert">{fieldError}</p>}
      {error && <p className="error" role="alert">{error}</p>}

      <button type="submit" disabled={isSaving}>{isSaving ? 'Création...' : 'Créer'}</button>
    </form>
  );
}

export default UserForm;
