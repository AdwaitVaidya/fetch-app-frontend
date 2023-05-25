import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";

interface MultiSelectCheckboxProps {
  label: string;
  options: string[];
  setSelectedOptionsChange: (data: string[]) => void;
}

const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
  label,
  options,
  setSelectedOptionsChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    const option = event.target.value;
    setSelectedOptions((prevSelectedOptions: string[]) => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions.filter(
          (selectedOption) => selectedOption !== option
        );
      } else {
        return [...prevSelectedOptions, option];
      }
    });
  };

  React.useEffect(() => {
    // Call the callback function in the parent component whenever the selected options change
    setSelectedOptionsChange(selectedOptions);
  }, [selectedOptions, setSelectedOptionsChange]);

  return (
    <div>
      <legend>{label}</legend>
      {options.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={selectedOptions.includes(option)}
              onChange={handleCheckboxChange}
              value={option}
            />
          }
          label={option}
        />
      ))}
    </div>
  );
};

export default MultiSelectCheckbox;
