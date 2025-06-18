"use client";
import React, { useRef, useState } from "react";
import JSZip from "jszip";

interface Preview {
    name: string;
    url?: string;
    error?: boolean;
    canvas?: HTMLCanvasElement;
}

export default function ImageNormalizationPage() {
    const [previews, setPreviews] = useState<Preview[]>([]);
    const croppedCanvases = useRef<{ name: string; canvas: HTMLCanvasElement }[]>([]);
    const fileInput = useRef<HTMLInputElement>(null);
    const [zipLoading, setZipLoading] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        setPreviews([]);
        croppedCanvases.current = [];
        Array.from(files).forEach((file) => {
            const img = new window.Image();
            img.onload = () => {
                const tempCanvas = document.createElement("canvas");
                const ctx = tempCanvas.getContext("2d")!;
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const { data, width, height } = imageData;
                let top: number | null = null, bottom: number | null = null, left: number | null = null, right: number | null = null;
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const alpha = data[(y * width + x) * 4 + 3];
                        if (alpha > 0) {
                            if (top === null) top = y;
                            bottom = y;
                            if (left === null || x < left) left = x;
                            if (right === null || x > right) right = x;
                        }
                    }
                }
                if (top === null || bottom === null || left === null || right === null) {
                    setPreviews((prev) => [
                        ...prev,
                        { name: file.name, error: true }
                    ]);
                    return;
                }
                const croppedWidth = right - left + 1;
                const croppedHeight = bottom - top + 1;
                const croppedData = ctx.getImageData(left, top, croppedWidth, croppedHeight);
                const croppedCanvas = document.createElement("canvas");
                croppedCanvas.width = croppedWidth;
                croppedCanvas.height = croppedHeight;
                const croppedCtx = croppedCanvas.getContext("2d")!;
                croppedCtx.putImageData(croppedData, 0, 0);
                croppedCanvases.current.push({ name: file.name, canvas: croppedCanvas });
                setPreviews((prev) => [
                    ...prev,
                    {
                        name: file.name,
                        url: croppedCanvas.toDataURL("image/png"),
                        canvas: croppedCanvas,
                    },
                ]);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleDownloadAll = async () => {
        setZipLoading(true);
        const zip = new JSZip();
        croppedCanvases.current.forEach(({ name, canvas }) => {
            const dataUrl = canvas.toDataURL("image/png");
            const base64 = dataUrl.split(",")[1];
            zip.file(name, base64, { base64: true });
        });
        const blob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "cropped_images.zip";
        link.click();
        setZipLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f4f4f4] p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Crop Transparent PNGs</h1>
                <input
                    type="file"
                    accept="image/png"
                    multiple
                    ref={fileInput}
                    className="mb-4"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                <button
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm mb-6 disabled:opacity-60"
                    style={{ display: croppedCanvases.current.length > 0 ? "inline-block" : "none" }}
                    onClick={handleDownloadAll}
                    disabled={zipLoading}
                >
                    {zipLoading ? "Zipping..." : "Download All as ZIP"}
                </button>
                <div className="flex flex-wrap gap-4">
                    {previews.map((preview, i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-3 flex flex-col items-center w-fit">
                            {preview.error ? (
                                <p className="text-red-500 text-xs">Image "{preview.name}" is fully transparent.</p>
                            ) : (
                                <>
                                    <img
                                        src={preview.url}
                                        alt={preview.name}
                                        className="max-w-[200px] mb-2 rounded border"
                                    />
                                    <button
                                        type="button"
                                        className="inline-block px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                        onClick={() => {
                                            if (!preview.url) return;
                                            const a = document.createElement('a');
                                            a.href = preview.url;
                                            a.download = preview.name;
                                            a.click();
                                        }}
                                    >
                                        Download {preview.name}
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 