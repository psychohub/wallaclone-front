import React, { useState, useEffect, useRef } from 'react';
import './multipleSelect.css';

interface Props {
	options: string[];
	selectedOptions: string[];
	onChange: (selectedOptions: string[]) => void;
	placeholder?: string;
	id?: string; 
  }

const MultipleSelect = ({ options, selectedOptions, onChange, placeholder }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
  
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

  const handleChange = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(c => c !== option)
      : [...selectedOptions, option];
    onChange(newSelectedOptions);
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === options.length) {
      onChange([]);
    } else {
      onChange(options);
    }
  };

	const toggleOpen = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	}

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

	const getPlaceholderText = () => {
		if (!selectedOptions || selectedOptions.length === 0) {
			return placeholder;
		} else if (selectedOptions.length > 2) {
			return `${selectedOptions[0]}, ${selectedOptions[1]}...`;
		} else {
			return selectedOptions.join(', ');
		}
	};

  return (
    <div className="multiselect-container" ref={dropdownRef}>
      <button onClick={toggleOpen} className="multiselect-button">
        <span>{getPlaceholderText()}</span><span className="arrow"></span>
      </button>
      
			<div className={`multiselect-dropdown ${isOpen ? 'open' : ''}`}>
				<div className="multiselect-dropdown-header">
					<label>
						<input type="checkbox" checked={selectedOptions.length === options.length} onChange={handleSelectAll} />
						Todas
					</label>
				</div>
				<div className="multiselect-dropdown-body">
					{options.map(option => (
						<label key={option} className="multiselect-dropdown-item">
							<input
								type="checkbox"
								checked={selectedOptions.includes(option)}
								onChange={() => handleChange(option)}
							/>
							{option}
						</label>
					))}
				</div>
			</div>

    </div>
  );
};

export default MultipleSelect;
