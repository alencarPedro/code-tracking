import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Option {
	value: string;
	label: string;
}

interface CustomComboboxProps {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	error?: boolean;
	className?: string;
}

const CustomCombobox = ({
	options,
	value,
	onChange,
	placeholder = '',
	error = false,
	className = '',
}: CustomComboboxProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
	const [displayValue, setDisplayValue] = useState('');
	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (value) {
			const selectedOption = options.find((opt) => opt.value === value || opt.label === value);
			setDisplayValue(selectedOption ? selectedOption.label : value);
		} else {
			setDisplayValue('');
		}
	}, [value, options]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleInputClick = () => {
		setFilteredOptions(options);
		setIsOpen(true);
	};

	const handleInputChange = (inputValue: string) => {
		setDisplayValue(inputValue);
		onChange(inputValue);

		const filtered = options.filter(
			(option) =>
				option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
				option.value.toLowerCase().includes(inputValue.toLowerCase())
		);

		setFilteredOptions(filtered);
		setIsOpen(true);
	};

	const handleOptionClick = (option: Option) => {
		setDisplayValue(option.label);
		onChange(option.value);
		setIsOpen(false);
		if (inputRef.current) {
			inputRef.current.blur();
		}
	};

	return (
		<div
			ref={wrapperRef}
			className="relative w-full">
			<Input
				ref={inputRef}
				value={displayValue}
				onChange={(e) => handleInputChange(e.target.value)}
				onClick={handleInputClick}
				onFocus={handleInputClick}
				placeholder={placeholder}
				className={cn('w-full h-11 sm:h-10', error && 'border-red-500 focus-visible:ring-red-500', className)}
			/>

			{isOpen && (
				<div className="absolute z-50 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg max-h-60">
					{filteredOptions.map((option, index) => (
						<div
							key={option.value}
							onClick={() => handleOptionClick(option)}
							className={cn(
								'px-3 py-2 text-sm cursor-pointer hover:bg-gray-100',
								option.value === value && 'bg-gray-100',
								index !== filteredOptions.length - 1 && 'border-b border-gray-100'
							)}>
							{option.label}
						</div>
					))}
					{filteredOptions.length === 0 && (
						<div className="px-3 py-2 text-sm text-gray-500">Nenhum resultado encontrado</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CustomCombobox;
