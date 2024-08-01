import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import UserAdList from '../components/UserAdList';

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div>
      <h1>Perfil de {user.nombre}</h1>
      <UserAdList />
    </div>
  );
};

export default ProfilePage;