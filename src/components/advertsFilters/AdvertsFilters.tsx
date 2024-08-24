import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { getCategories } from "../../api/categories";
import MultipleSelect from "../multipleSelect/MultipleSelect";
import { IAdvertsFilters, initialFilterValues } from "../../types/adverts";
import './advertsFilters.css';

type Props = {
	onFilter: (filters: IAdvertsFilters) => void;
};

const AdvertsFilters = ({ onFilter }: Props) => {
	const [filter, setFilter] = useState<IAdvertsFilters>(initialFilterValues);
	const [categories, setCategories] = useState<string[]>([]);

	useEffect(() => {
		const categories = getCategories();
		setCategories(categories);
	}, []);
	
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onFilter(filter);
	};

	const handleRemoveFilters = (e: React.MouseEvent<HTMLElement>) => {
		setFilter(initialFilterValues);
		onFilter(initialFilterValues);
	};

	const handleFilterSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
		setFilter({ ...filter, [id]: value });
  };

	const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
		setFilter({ ...filter, [id]: value });
  };

	const handleTagsChange = (selectedCategories: string[]) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      tags: selectedCategories
    }));
  };
	
	return (
		<Container>
			<Row>
				<Col>
					<Form
						className="filters"
						onSubmit={handleSubmit}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSubmit(e);
						}}>
						<div className="term-filter">
							<Form.Group className="mb-3">
								<Form.Control
									type="text"
									id="searchTerm"
									placeholder="Buscar artículos..."
									value={filter.searchTerm}
									onChange={handleFilterInputChange}
								/>
							</Form.Group>
						</div>

						<div className="other-filters">
							<Form.Group className="mb-3">
								<MultipleSelect 
									options={categories}
									selectedOptions={filter.tags}
									onChange={handleTagsChange}
									placeholder="Categorías"
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Select 
									id="tipoAnuncio"
									value={filter.tipoAnuncio}
									onChange={handleFilterSelectChange}
									>
									<option value="">Venta/Búsqueda</option>
									<option value="venta">Venta</option>
									<option value="búsqueda">Búsqueda</option>
								</Form.Select>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Control
									type="number"
									id="precioMin"
									value={filter.precioMin}
									onChange={handleFilterInputChange}
									placeholder="Precio mínimo"
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Control
									type="number"
									id="precioMax"
									value={filter.precioMax}
									onChange={handleFilterInputChange}
									placeholder="Precio máximo"
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Select 
									id="sort"
									value={filter.sort}
									onChange={handleFilterSelectChange}
									>
									<option value="">Ordenar por</option>
									<option value="desc">Más reciente</option>
									<option value="asc">Más antiguo</option>
								</Form.Select>
							</Form.Group>
						</div>

						<div className="action-filters">
							<Button variant="primary" type="submit">
								Filtrar y ordenar
							</Button>
							<Button variant="outline-primary" type="button" onClick={handleRemoveFilters}>
								Limpiar filtros
							</Button>
						</div>

					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default AdvertsFilters;
