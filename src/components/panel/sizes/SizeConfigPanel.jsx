import { useEffect, useState } from "react";
import { useLayout } from "../../../context/LayoutProvider";
import { useRefresh } from "../../../context/RefreshContext";
import UnitSelector from "./UnitSelector";
import SizeInput from "./SizeInput";

const SizeConfigPanel = () => {
    const layout = useLayout();
    const { handleRefresh } = useRefresh();

    const mmToPt = (mm) => mm * 2.8346456693;
    const ptToMm = (pt) => pt / 2.8346456693;
    const inToPt = (inch) => inch * 72;

    // CLEAN FORMATTER — removes unnecessary decimals
    const cleanNumber = (num) => {
        if (num == null || isNaN(num)) return "0";
        const rounded = parseFloat(num.toFixed(2));
        return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
    };

    // PURE INPUTS
    const [paperWidthInput, setPaperWidthInput] = useState("");
    const [paperHeightInput, setPaperHeightInput] = useState("");
    const [labelWidthInput, setLabelWidthInput] = useState("");
    const [labelHeightInput, setLabelHeightInput] = useState("");

    // Sync initial values
    useEffect(() => {
        const toDisplay = (pt, unit) =>
            unit === "mm"
                ? cleanNumber(ptToMm(pt))
                : cleanNumber(pt / 72);

        setPaperWidthInput(toDisplay(layout.values.paperWidthPt, layout.values.paperUnit));
        setPaperHeightInput(toDisplay(layout.values.paperHeightPt, layout.values.paperUnit));
        setLabelWidthInput(toDisplay(layout.values.labelWidthPt, layout.values.labelUnit));
        setLabelHeightInput(toDisplay(layout.values.labelHeightPt, layout.values.labelUnit));
    }, [
        layout.values.paperWidthPt,
        layout.values.paperHeightPt,
        layout.values.labelWidthPt,
        layout.values.labelHeightPt,
        layout.values.paperUnit,
        layout.values.labelUnit,
    ]);

    // ⭐ Sync values when preset updates
    useEffect(() => {
        if (!layout.values.presetUpdate) return;

        setPaperWidthInput(
            cleanNumber(ptToMm(layout.values.paperWidthPt))
        );
        setPaperHeightInput(
            cleanNumber(ptToMm(layout.values.paperHeightPt))
        );
        setLabelWidthInput(
            cleanNumber(ptToMm(layout.values.labelWidthPt))
        );
        setLabelHeightInput(
            cleanNumber(ptToMm(layout.values.labelHeightPt))
        );

        layout.set.setPresetUpdate(false);
    }, [
        layout.values.paperWidthPt,
        layout.values.paperHeightPt,
        layout.values.labelWidthPt,
        layout.values.labelHeightPt,
        layout.values.presetUpdate
    ]);

    useEffect(() => {
        const { paperWidthPt, paperHeightPt, paperUnit, labelWidthPt, labelHeightPt, labelUnit } = layout.values;

        const toDisplayPaper = (pt) =>
            paperUnit === "mm"
                ? cleanNumber(ptToMm(pt))
                : cleanNumber(pt / 72);

        const toDisplayLabel = (pt) =>
            labelUnit === "mm"
                ? cleanNumber(ptToMm(pt))
                : cleanNumber(pt / 72);

        setPaperWidthInput(toDisplayPaper(paperWidthPt));
        setPaperHeightInput(toDisplayPaper(paperHeightPt));
        setLabelWidthInput(toDisplayLabel(labelWidthPt));
        setLabelHeightInput(toDisplayLabel(labelHeightPt));
    }, [
        layout.values.paperUnit,
        layout.values.paperWidthPt,
        layout.values.paperHeightPt,
        layout.values.labelUnit,
        layout.values.labelWidthPt,
        layout.values.labelHeightPt,
    ]);



    // ---------------------------
    // INPUT HANDLERS
    // ---------------------------
    const handlePaperWidthChange = (val) => {
        setPaperWidthInput(val);

        if (val === "") return; // allow empty while typing

        const n = Number(val);
        if (isNaN(n)) return;

        layout.set.setPaperWidthPt(
            layout.values.paperUnit === "mm" ? mmToPt(n) : inToPt(n)
        );
    };

    const handlePaperHeightChange = (val) => {
        setPaperHeightInput(val);
        const n = Number(val);
        if (!isNaN(n)) {
            layout.set.setPaperHeightPt(
                layout.values.paperUnit === "mm" ? mmToPt(n) : inToPt(n)
            );
        }
        handleRefresh();
    };

    const handleLabelWidthChange = (val) => {
        setLabelWidthInput(val);
        const n = Number(val);
        if (!isNaN(n)) {
            const pt = layout.values.labelUnit === "mm" ? mmToPt(n) : inToPt(n);
            layout.set.setLabelWidthPt(pt);
            layout.set.setFontScale(pt / 120);
        }
        handleRefresh();
    };

    const handleLabelHeightChange = (val) => {
        setLabelHeightInput(val);
        const n = Number(val);
        if (!isNaN(n)) {
            const pt = layout.values.labelUnit === "mm" ? mmToPt(n) : inToPt(n);
            layout.set.setLabelHeightPt(pt);
        }
        handleRefresh();
    };

    // UNIT SWITCHERS
    const handlePaperUnitChange = (newUnit) => {
        layout.set.setPaperUnit(newUnit);

        const w = Number(paperWidthInput);
        const h = Number(paperHeightInput);

        if (!isNaN(w))
            layout.set.setPaperWidthPt(newUnit === "mm" ? mmToPt(w) : inToPt(w));

        if (!isNaN(h))
            layout.set.setPaperHeightPt(newUnit === "mm" ? mmToPt(h) : inToPt(h));

        handleRefresh();
    };

    const handleLabelUnitChange = (newUnit) => {
        layout.set.setLabelUnit(newUnit);

        const w = Number(labelWidthInput);
        const h = Number(labelHeightInput);

        if (!isNaN(w)) {
            const pt = newUnit === "mm" ? mmToPt(w) : inToPt(w);
            layout.set.setLabelWidthPt(pt);
            layout.set.setFontScale(pt / 120);
        }

        if (!isNaN(h)) {
            layout.set.setLabelHeightPt(newUnit === "mm" ? mmToPt(h) : inToPt(h));
        }

        handleRefresh();
    };

    return (
        <div className="w-full flex flex-col gap-4 p-2.5 border-b-2 bg-nero-800 border-nero-900">

            <div className="flex flex-col gap-1">
                <h2 className="text-lg text-nero-400 font-medium">Page Size</h2>

                <div className="w-full flex items-center gap-2">
                    <SizeInput
                        label="Width"
                        value={paperWidthInput}
                        onValueChange={handlePaperWidthChange}
                    />
                    <SizeInput
                        label="Height"
                        value={paperHeightInput}
                        onValueChange={handlePaperHeightChange}
                    />
                    <UnitSelector
                        value={layout.values.paperUnit}
                        onChange={handlePaperUnitChange}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <h2 className="text-lg text-nero-400 font-medium">Label Size</h2>

                <div className="w-full flex items-center gap-2">
                    <SizeInput
                        label="Width"
                        value={labelWidthInput}
                        onValueChange={handleLabelWidthChange}
                    />
                    <SizeInput
                        label="Height"
                        value={labelHeightInput}
                        onValueChange={handleLabelHeightChange}
                    />
                    <UnitSelector
                        value={layout.values.labelUnit}
                        onChange={handleLabelUnitChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default SizeConfigPanel;
