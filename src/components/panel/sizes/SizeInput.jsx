import React from "react";

const SizeInput = ({ label, value, onValueChange }) => {
    return (
        <div className="w-[26%] flex flex-col gap-0.5">
            <label htmlFor={label} className="text-sm text-nero-400 font-medium">
                {label}
            </label>

            <input
                type="number"
                id={label}
                className="no-spinner w-full h-8 px-2 py-1 bg-nero-700 rounded-md border border-nero-600 text-sm"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => {
                    if (e.target.value === "") {
                        onValueChange("0"); // set to 0
                    }
                }}
            />
        </div>
    );
};

export default SizeInput;
