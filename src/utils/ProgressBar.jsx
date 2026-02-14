import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function ProgressBar({ progress, phase, onComplete }) {
    const isLoading = progress < 100;

    const hasCompletedRef = useRef(false);

    useEffect(() => {
        if (progress === 100 && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete && onComplete();
        }

        if (progress < 100) {
            hasCompletedRef.current = false;
        }
    }, [progress, onComplete]);

    const getLabel = () => {
        if (progress >= 100) return "Completed!";

        if (phase === "qr") return "Generating QR Codes...";
        if (phase === "pdf") return "Generating PDF...";
        if (phase === "merge") return "Merging PDF...";

        return "Working...";
    };

    return (
        <motion.div
            key="progressBar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col items-center gap-2 mb-2"
        >
            <div className="w-full flex justify-center items-center flex-col">
                <div className="w-full flex justify-center items-center gap-2">
                    <div className="w-64 h-2 bg-nero-700 rounded-full overflow-hidden">
                        <div
                            className="h-3 bg-denim-600 transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <span className="w-10 flex justify-center text-nero-300 items-center">
                        {progress}%
                    </span>
                </div>

                <div className="text-nero-300 text-sm flex items-center gap-1.5">
                    {isLoading && (
                        <div className="w-3 h-3 border-2 border-nero-500 border-t-transparent rounded-full animate-spin" />
                    )}

                    {getLabel()}
                </div>
            </div>
        </motion.div>
    );
}
