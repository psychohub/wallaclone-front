import React from 'react';
import { useAuth } from '../hooks/useAuth';
import UserAdList from '../components/UserAdList'; 

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Por favor, inicia sesión para ver tu perfil.</div>;
  }

  return (
    <div>
      <h1>Perfil de {user.nombre}</h1>
      <UserAdList />
    </div>
  );
};

export default ProfilePage;