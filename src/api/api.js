const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

let accessToken = null;
let refreshToken = null;

function makeError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function readBody(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
}

async function send(path, method, body, token) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;

  let response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (error) {
    throw makeError(0, 'Serveur injoignable. Vérifiez que le backend est démarré.');
  }

  const data = await readBody(response);
  if (!response.ok) {
    throw makeError(response.status, data.message || 'Erreur inattendue');
  }
  return data;
}

async function renewTokens() {
  try {
    const data = await send('/auth/refresh', 'POST', { refreshToken }, null);
    accessToken = data.accessToken;
    refreshToken = data.refreshToken;
  } catch (error) {
    accessToken = null;
    refreshToken = null;
    throw makeError(401, 'Session expirée. Veuillez vous reconnecter.');
  }
}

export async function login(email, password) {
  const data = await send('/auth/login', 'POST', { email, password }, null);
  accessToken = data.accessToken;
  refreshToken = data.refreshToken;
  return data.user;
}

export async function logout() {
  if (accessToken) {
    await send('/auth/logout', 'POST', null, accessToken).catch(() => {});
  }
  accessToken = null;
  refreshToken = null;
}

export async function request(path, method = 'GET', body = null) {
  try {
    return await send(path, method, body, accessToken);
  } catch (error) {
    if (error.status !== 401 || !refreshToken) throw error;
  }
  await renewTokens();
  return await send(path, method, body, accessToken);
}

export function clearSession() {
  accessToken = null;
  refreshToken = null;
}

export async function getUsers() {
  const data = await request('/auth/utilisateurs');
  return data.data;
}

export async function createChauffeur(nom, email, motDePasse) {
  return await request('/auth/chauffeurs', 'POST', { nom, email, motDePasse });
}

export async function suspendChauffeur(id) {
  return await request('/auth/chauffeurs/' + id + '/suspendre', 'PATCH');
}

export async function reactivateChauffeur(id) {
  return await request('/auth/chauffeurs/' + id + '/reactiver', 'PATCH');
}

export async function getTrucks() {
  const data = await request('/camions');
  return data.data;
}

export async function createTruck(truck) {
  return await request('/camions', 'POST', truck);
}

export async function updateTruck(id, truck) {
  return await request('/camions/' + id, 'PUT', truck);
}

export async function archiveTruck(id) {
  return await request('/camions/' + id + '/archive', 'PATCH');
}

export async function getMyTrips() {
  const data = await request('/trajets/mes-trajets');
  return data.data;
}
