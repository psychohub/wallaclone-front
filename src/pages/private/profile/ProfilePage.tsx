import React, { useState } from 'react';
import { Card, Container, Dropdown, Tab, Tabs } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import UpdateInfoTab from '../../../components/profile/UpdateInfoTab';
import ChangePasswordTab from '../../../components/profile/ChangePasswordTab';
import DeleteAccountTab from '../../../components/profile/DeleteAccountTab';
import './profilePage.css';

const ProfilePage: React.FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const [show, setShow] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(0);

  const handleToggle = () => {
    setShow(!show);
  };

  const handleMobileSelect = (option: number) => {
    setSelected(option);
    setShow(false);
  };
  
  return (
    <div className="page">
      <Container className="page-title-container">
        <h2 className="page-title">Mi Perfil</h2>
      </Container>
      <Card className="card-container">
        <Card.Body>
          {
          isMobile
          ? (
            <>
              <Dropdown show={show} onToggle={handleToggle}>
                <Dropdown.Toggle variant="outline-primary" className='profile-options-button'>
                  Opciones
                </Dropdown.Toggle>
                <Dropdown.Menu className='profile-options'>
                  <Dropdown.ItemText onClick={() => handleMobileSelect(0)}>Actualizar datos</Dropdown.ItemText>
                  <Dropdown.ItemText onClick={() => handleMobileSelect(1)}>Cambiar contraseña</Dropdown.ItemText>
                  <Dropdown.ItemText onClick={() => handleMobileSelect(2)}>Eliminar cuenta</Dropdown.ItemText>
                </Dropdown.Menu>
              </Dropdown>
              <Container className="profile-container">
                { selected === 0 && <UpdateInfoTab /> }
                { selected === 1 && <ChangePasswordTab /> }
                { selected === 2 && <DeleteAccountTab /> }
              </Container>
            </>
          ) : (
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
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePage;
