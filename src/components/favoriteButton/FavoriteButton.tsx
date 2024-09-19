import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { addFavorite, removeFavorite } from '../../api/adverts';
import { useAppSelector } from '../../hooks/useStore';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  anuncioId: string;
  isFavorite: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ anuncioId, isFavorite, onFavoriteChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const handleToggleFavorite = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(anuncioId);
      } else {
        await addFavorite(anuncioId);
      }
      onFavoriteChange(!isFavorite);
    } catch (error) {
      console.error('Error al cambiar el estado de favorito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Button 
      variant="link" 
      className="favorite-button" 
      onClick={handleToggleFavorite} 
      disabled={isLoading}
      aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
    >
      <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarRegular} />
    </Button>
  );
};

export default FavoriteButton;