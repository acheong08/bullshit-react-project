interface DropdownProps {
	label: string;
	options: string[];
	value: string;
	onChange: (value: string) => void;
	id: string;
}

export function Dropdown({
	label,
	options,
	value,
	onChange,
	id,
}: DropdownProps) {
	return (
		<div className="dropdown-container">
			<label htmlFor={id} className="option-header">
				{label}
			</label>
			<select
				id={id}
				className="dropdown-select"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
}
