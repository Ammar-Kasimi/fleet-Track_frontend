import { useState } from 'react';

function LoginForm({ onLogin, isLoading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (email.trim() === '' || password === '') {
      setFieldError("L'email et le mot de passe sont obligatoires.");
      return;
    }
    setFieldError('');
    const success = await onLogin(email.trim(), password);
    if (success) setPassword('');
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2>Connexion</h2>

      <label htmlFor="login-email">Email</label>
      <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label htmlFor="login-password">Mot de passe</label>
      <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {fieldError && <p className="error" role="alert">{fieldError}</p>}
      {error && <p className="error" role="alert">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}

export default LoginForm;
