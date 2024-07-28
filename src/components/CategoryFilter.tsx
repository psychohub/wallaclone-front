import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (selectedCategories: string[]) => void;
  onApply: () => void;
  onReset: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategories, onChange, onApply, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (category: string) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    console.log('New selected categories:', newSelectedCategories);
    onChange(newSelectedCategories);
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      onChange([]);
    } else {
      onChange(categories);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleApplyClick = () => {
    setIsOpen(false);
    onApply();
  };

  return (
    <div className="category-filter" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="filter-button">
        Categoría <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="dropdown">
          <div className="dropdown-header">
          </div>
          <div className="dropdown-body">
            {categories.map(category => (
              <label key={category} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
          <div className="dropdown-footer hidden"> 
            <button onClick={() => {}} className="cancel-button">Cancelar</button>
            <button onClick={() => {}} className="apply-button">Aplicar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
