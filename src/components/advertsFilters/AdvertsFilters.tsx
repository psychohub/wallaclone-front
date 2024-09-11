import React, { useEffect, useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { getCategories } from "../../api/categories";
import MultipleSelect from "../multipleSelect/MultipleSelect";
import { IAdvertsFilters, initialFilterValues } from "../../types/adverts";
import './advertsFilters.css';

type Props = {
  onFilter: (filters: IAdvertsFilters) => void;
};

const AdvertsFilters: React.FC<Props> = ({ onFilter }) => {
  const [filter, setFilter] = useState<IAdvertsFilters>(initialFilterValues);
  const [categories, setCategories] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const categories = getCategories();
    setCategories(categories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filter);
  };

  const handleRemoveFilters = () => {
    setFilter(initialFilterValues);
    onFilter(initialFilterValues);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLElement>) => {
	const target = e.target as HTMLInputElement | HTMLSelectElement;
	const { id, value } = target;
	setFilter(prevFilter => ({ ...prevFilter, [id]: value }));
  };

  const handleTagsChange = (selectedCategories: string[]) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      tags: selectedCategories
    }));
  };

  return (
    <Container fluid className="adverts-filters-container">
      <Form onSubmit={handleSubmit} className="filters-form">
        <Row className="mb-3">
          <Col xs={12} lg={9}>
            <Form.Group>
              <Form.Label htmlFor="searchTerm" className="visually-hidden">Buscar artículos</Form.Label>
              <Form.Control
  type="text"
  id="searchTerm"
  placeholder="Buscar artículos..."
  value={filter.searchTerm}
  onChange={handleFilterChange as React.ChangeEventHandler<HTMLInputElement>}
/>
            </Form.Group>
          </Col>
          <Col xs={6} lg={1}>
            <Button variant="primary" type="submit" className="w-100">
              <i className="bi bi-search"></i>
            </Button>
          </Col>
          <Col xs={6} lg={2}>
            <Button 
              variant="outline-secondary" 
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls="advanced-filters"
              className="w-100"
            >
              <i className={`bi bi-sliders ${isExpanded ? 'expanded' : ''}`}></i>
              <span className="ms-2 d-none d-lg-inline">Filtros</span>
            </Button>
          </Col>
        </Row>

        <div id="advanced-filters" className={`advanced-filters ${isExpanded ? 'show' : ''}`}>
          <Row className="mb-3">
            <Col xs={12} md={6} lg={4}>
              <Form.Group>
                <Form.Label htmlFor="categories">Categorías</Form.Label>
                <MultipleSelect 
  options={categories}
  selectedOptions={filter.tags}
  onChange={handleTagsChange as (selectedCategories: string[]) => void}
  placeholder="Seleccionar categorías"
  id="categories"
/>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Form.Group>
                <Form.Label htmlFor="tipoAnuncio">Tipo de anuncio</Form.Label>
				<Form.Select 
  id="tipoAnuncio"
  value={filter.tipoAnuncio}
  onChange={handleFilterChange as React.ChangeEventHandler<HTMLSelectElement>}
>
                  <option value="">Todos</option>
                  <option value="venta">Venta</option>
                  <option value="búsqueda">Búsqueda</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Form.Group>
                <Form.Label htmlFor="sort">Ordenar por</Form.Label>
                <Form.Select 
                  id="sort"
                  value={filter.sort}
                  onChange={handleFilterChange}
                >
                  <option value="">Sin ordenar</option>
                  <option value="desc">Más reciente</option>
                  <option value="asc">Más antiguo</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label htmlFor="precioMin">Precio mínimo</Form.Label>
                <Form.Control
                  type="number"
                  id="precioMin"
                  value={filter.precioMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label htmlFor="precioMax">Precio máximo</Form.Label>
                <Form.Control
                  type="number"
                  id="precioMax"
                  value={filter.precioMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Button variant="primary" type="submit" className="w-100 mb-2 mb-md-0">
                Aplicar filtros
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button variant="outline-secondary" type="button" onClick={handleRemoveFilters} className="w-100">
                Limpiar filtros
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </Container>
  );
};

export default AdvertsFilters;