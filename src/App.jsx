import { useState } from 'react';
import AppShell from './components/AppShell';
import AdminLayout from './components/AdminLayout';
import DriverLayout from './components/DriverLayout';
import LoginForm from './components/LoginForm';
import ProtectedView from './components/ProtectedView';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserForm from './components/UserForm';
import TruckList from './components/TruckList';
import TruckDetail from './components/TruckDetail';
import TruckForm from './components/TruckForm';
import TripList from './components/TripList';
import {
  login, logout, clearSession, getUsers,
  createChauffeur, suspendChauffeur, reactivateChauffeur,
  getTrucks, createTruck, updateTruck, archiveTruck, getMyTrips
} from './api/api';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeView, setActiveView] = useState('users');

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');

  const [trucks, setTrucks] = useState([]);
  const [trucksLoading, setTrucksLoading] = useState(false);
  const [trucksError, setTrucksError] = useState('');
  const [truckStatusFilter, setTruckStatusFilter] = useState('ALL');
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [truckFormMode, setTruckFormMode] = useState('none');
  const [truckFormError, setTruckFormError] = useState('');
  const [truckActionError, setTruckActionError] = useState('');

  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState('');

  const visibleUsers = [];
  for (const u of users) {
    const roleOk = roleFilter === 'ALL' || u.role === roleFilter;
    const statusOk = statusFilter === 'ALL' || u.statutCompte === statusFilter;
    if (roleOk && statusOk) visibleUsers.push(u);
  }
  const selectedUser = users.find((u) => u._id === selectedUserId);

  const visibleTrucks = [];
  for (const t of trucks) {
    if (truckStatusFilter === 'ALL' || t.statut === truckStatusFilter) visibleTrucks.push(t);
  }
  const selectedTruck = trucks.find((t) => t._id === selectedTruckId);

  function handleRequestError(error, setMessage) {
    if (error.status === 401) {
      clearSession();
      setUser(null);
      setLoginError(error.message);
    } else if (error.status === 403) {
      setMessage('Accès refusé');
    } else {
      setMessage(error.message);
    }
  }

  async function loadUsers() {
    setUsersLoading(true);
    setUsersError('');
    try {
      const list = await getUsers();
      setUsers(list);
    } catch (error) {
      handleRequestError(error, setUsersError);
    } finally {
      setUsersLoading(false);
    }
  }

  async function loadTrucks() {
    setTrucksLoading(true);
    setTrucksError('');
    try {
      const list = await getTrucks();
      setTrucks(list);
    } catch (error) {
      handleRequestError(error, setTrucksError);
    } finally {
      setTrucksLoading(false);
    }
  }

  async function loadTrips() {
    setTripsLoading(true);
    setTripsError('');
    try {
      const list = await getMyTrips();
      setTrips(list);
    } catch (error) {
      handleRequestError(error, setTripsError);
    } finally {
      setTripsLoading(false);
    }
  }

  async function handleLogin(email, password) {
    setIsLoading(true);
    setLoginError('');
    try {
      const loggedUser = await login(email, password);
      setUser(loggedUser);
      setActiveView('users');
      if (loggedUser.role === 'ADMIN') loadUsers();
      if (loggedUser.role === 'CHAUFFEUR') loadTrips();
      return true;
    } catch (error) {
      setLoginError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
    setUsers([]);
    setTrucks([]);
    setTrips([]);
    setTruckFormMode('none');
    setTruckStatusFilter('ALL');
    setActiveView('users');
    setSelectedUserId(null);
    setSelectedTruckId(null);
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  }

  function handleNavigate(view) {
    setActiveView(view);
    if (view === 'users') loadUsers();
    if (view === 'trucks') loadTrucks();
  }

  function handleSelectTruck(id) {
    setSelectedTruckId(id);
    setTruckFormMode('none');
    setTruckActionError('');
  }

  function handleNewTruck() {
    setSelectedTruckId(null);
    setTruckFormError('');
    setTruckFormMode('create');
  }

  function handleEditTruck() {
    setTruckFormError('');
    setTruckFormMode('edit');
  }

  async function handleSaveTruck(data) {
    setIsSaving(true);
    setTruckFormError('');
    try {
      if (truckFormMode === 'create') {
        await createTruck(data);
      } else {
        await updateTruck(selectedTruckId, data);
      }
      await loadTrucks();
      setTruckFormMode('none');
    } catch (error) {
      handleRequestError(error, setTruckFormError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchiveTruck(truck) {
    if (!window.confirm('Archiver le camion ' + truck.immatriculation + ' ?')) return;
    setIsSaving(true);
    setTruckActionError('');
    try {
      await archiveTruck(truck._id);
      setSelectedTruckId(null);
      await loadTrucks();
    } catch (error) {
      handleRequestError(error, setTruckActionError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateUser(nom, email, motDePasse) {
    setIsSaving(true);
    setFormError('');
    try {
      await createChauffeur(nom, email, motDePasse);
      await loadUsers();
      return true;
    } catch (error) {
      handleRequestError(error, setFormError);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangeStatus(userToChange) {
    setIsSaving(true);
    setActionError('');
    try {
      if (userToChange.statutCompte === 'ACTIF') {
        await suspendChauffeur(userToChange._id);
      } else {
        await reactivateChauffeur(userToChange._id);
      }
      await loadUsers();
    } catch (error) {
      handleRequestError(error, setActionError);
    } finally {
      setIsSaving(false);
    }
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} isLoading={isLoading} error={loginError} />;
  }

  return (
    <AppShell user={user} onLogout={handleLogout}>
      {user.role === 'ADMIN' ? (
        <ProtectedView user={user} allowedRoles={['ADMIN']}>
          <AdminLayout activeView={activeView} onNavigate={handleNavigate}>
            {activeView === 'users' ? (
              <>
                <h2>Utilisateurs</h2>
                <div className="split">
                  <UserList
                    users={visibleUsers}
                    selectedId={selectedUserId}
                    onSelect={setSelectedUserId}
                    isLoading={usersLoading}
                    error={usersError}
                    roleFilter={roleFilter}
                    statusFilter={statusFilter}
                    onRoleFilterChange={setRoleFilter}
                    onStatusFilterChange={setStatusFilter}
                  />
                  <div>
                    <UserDetail
                      user={selectedUser}
                      onChangeStatus={handleChangeStatus}
                      isSaving={isSaving}
                      error={actionError}
                    />
                    <UserForm onSubmit={handleCreateUser} isSaving={isSaving} error={formError} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2>Camions</h2>
                <button onClick={handleNewTruck}>Nouveau camion</button>
                <div className="split">
                  <TruckList
                    trucks={visibleTrucks}
                    selectedId={selectedTruckId}
                    onSelect={handleSelectTruck}
                    isLoading={trucksLoading}
                    error={trucksError}
                    statusFilter={truckStatusFilter}
                    onStatusFilterChange={setTruckStatusFilter}
                  />
                  <div>
                    <TruckDetail
                      truck={selectedTruck}
                      onEdit={handleEditTruck}
                      onArchive={handleArchiveTruck}
                      isSaving={isSaving}
                      error={truckActionError}
                    />
                    {truckFormMode !== 'none' && (
                      <TruckForm
                        key={truckFormMode + selectedTruckId}
                        initialValues={truckFormMode === 'edit' ? selectedTruck : null}
                        onSubmit={handleSaveTruck}
                        onCancel={() => setTruckFormMode('none')}
                        isSaving={isSaving}
                        error={truckFormError}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </AdminLayout>
        </ProtectedView>
      ) : (
        <ProtectedView user={user} allowedRoles={['CHAUFFEUR']}>
          <DriverLayout user={user} onShowTrips={loadTrips}>
            <TripList trips={trips} isLoading={tripsLoading} error={tripsError} />
          </DriverLayout>
        </ProtectedView>
      )}
    </AppShell>
  );
}

export default App;
