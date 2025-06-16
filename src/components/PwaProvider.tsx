"use client";
import { useEffect } from "react";

export default function PwaProvider() {
    useEffect(() => {
        if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
            navigator.serviceWorker.register("/sw.js");
        }
    }, []);
    return null;
} 