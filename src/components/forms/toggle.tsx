interface OptionToggleProps {
	label: string;
	id: string;
	isChecked: boolean;
	onChange: () => void;
}

export function Toggle({ label, isChecked, onChange, id }: OptionToggleProps) {
	return (
		<div className="toggle-container">
			<h2 className="option-header">{label}</h2>
			<input
				type="checkbox"
				id={id}
				checked={isChecked}
				onChange={onChange}
				className="toggle-checkbox"
			/>
			<label htmlFor={id} className="toggle-label">
				{label}
			</label>
		</div>
	);
}
