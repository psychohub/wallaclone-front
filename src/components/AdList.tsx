import React from 'react';

const AdList = () => {
  const ads = [
    { id: 1, title: 'iPhone 12', price: 500, image: '/images/iphone12.jpg' },
    { id: 2, title: 'Bicicleta de montaña', price: 300, image: '/images/mountain-bike.jpg' },
    { id: 3, title: 'MacBook Pro', price: 1200, image: '/images/macbook-pro.jpg' },
    { id: 4, title: 'PlayStation 5', price: 450, image: '/images/ps5.jpg' },
    { id: 5, title: 'Cámara DSLR', price: 600, image: '/images/dslr-camera.jpg' },
    { id: 6, title: 'Smartwatch', price: 150, image: '/images/smartwatch.jpg' },
    { id: 7, title: 'Drone', price: 350, image: '/images/drone.jpg' },
    { id: 8, title: 'Tablet', price: 200, image: '/images/tablet.jpg' },
    { id: 9, title: 'Altavoces Bluetooth', price: 80, image: '/images/bluetooth-speakers.jpg' },
    { id: 10, title: 'Teclado mecánico', price: 100, image: '/images/mechanical-keyboard.jpg' },
    { id: 11, title: 'Monitor 4K', price: 300, image: '/images/4k-monitor.jpg' },
    { id: 12, title: 'Silla de oficina', price: 150, image: '/images/office-chair.jpg' },
    { id: 13, title: 'Auriculares inalámbricos', price: 120, image: '/images/wireless-headphones.jpg' },
    { id: 14, title: 'Impresora 3D', price: 250, image: '/images/3d-printer.jpg' },
    { id: 15, title: 'Consola Nintendo Switch', price: 280, image: '/images/nintendo-switch.jpg' },
    { id: 16, title: 'Aspiradora robot', price: 200, image: '/images/robot-vacuum.jpg' },
  ];

  return (
    <div className="ad-list-container">
      <h2>Anuncios</h2>
      <div className="ad-list">
        {ads.map(ad => (
          <div key={ad.id} className="ad-card">
            <img src={ad.image} alt={ad.title} />
            <div className="ad-card-content">
              <h3>{ad.title}</h3>
              <p className="price">{ad.price}€</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdList;