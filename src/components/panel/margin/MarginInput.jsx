// MarginInput.jsx
import React, { useState, useEffect } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLayout } from "../../../context/LayoutProvider";

const mmToPt = (mm) => mm * 2.834645669;
const ptToMm = (pt) => pt / 2.834645669;

const MarginInput = ({ label }) => {
    const layout = useLayout();

    const keyMap = {
        Top: "topMargin",
        Bottom: "bottomMargin",
        Left: "leftMargin",
        Right: "rightMargin",
    };

    const key = keyMap[label];
    const valuePt = layout.values[key];

    // LOCAL INPUT STATE (solves typing issue)
    const [inputValue, setInputValue] = useState("");

    // Sync when PT changes (but NOT reformat)
    useEffect(() => {
        const mm = ptToMm(valuePt);
        setInputValue(String(Number(mm.toFixed(2))));
    }, [valuePt]);

    const update = (mmValue) => {
        setInputValue(mmValue); // let user type freely

        const num = Number(mmValue);
        if (isNaN(num)) return;

        const pt = mmToPt(num);
        layout.set[`set${label}Margin`](pt);
        layout.set.setUserMarginOverride(true);
    };

    const increase = () => update((Number(inputValue) || 0) + 1);
    const decrease = () => update((Number(inputValue) || 0) - 1);

    return (
        <div className="w-[50%] flex flex-col gap-0.5">
            <label className="text-sm text-nero-400 font-medium">{label}</label>

            <div className="w-full h-8 flex rounded-md">
                
                {/* Up/Down Buttons */}
                <div className="h-8 w-6 bg-nero-750 border border-nero-600 border-r-0 flex flex-col rounded-bl-md rounded-tl-md overflow-hidden">
                    <button
                        type="button"
                        onClick={increase}
                        className="flex-1 flex items-center justify-center text-nero-400 hover:text-nero-300"
                    >
                        <KeyboardArrowUpIcon sx={{ fontSize: 16, marginBottom: "-2px" }} />
                    </button>
                    <button
                        type="button"
                        onClick={decrease}
                        className="flex-1 flex items-center justify-center text-nero-400 hover:text-nero-300"
                    >
                        <KeyboardArrowDownIcon sx={{ fontSize: 16, marginTop: "-2px" }} />
                    </button>
                </div>

                {/* Free typing input field */}
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => update(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="no-spinner w-[80%] h-8 px-2 py-1 bg-nero-700 border border-nero-600 rounded-md rounded-bl-none rounded-tl-none text-sm"
                />
            </div>
        </div>
    );
};

export default MarginInput;
