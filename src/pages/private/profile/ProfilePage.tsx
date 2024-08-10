import React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';

import UpdateInfoTab from '../../../components/profile/UpdateInfoTab';
import ChangePasswordTab from '../../../components/profile/ChangePasswordTab';
import DeleteAccountTab from '../../../components/profile/DeleteAccountTab';

import './profilePage.css';

const ProfilePage: React.FC = () => {
  return (
    <div id="profile-page">
      <Card className="card-container">
        <Card.Title>
          <h2 className="page-title">Mi Perfil</h2>
        </Card.Title>
        <Card.Body>
          <Tabs defaultActiveKey="updateInfo" className="profile-tabs">
            <Tab eventKey="updateInfo" title="Actualizar datos">
              <UpdateInfoTab />
            </Tab>
            <Tab eventKey="changePassword" title="Cambiar contraseña">
              <ChangePasswordTab />
            </Tab>
            <Tab eventKey="deleteAccount" title="Eliminar cuenta">
              <DeleteAccountTab />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePage;
