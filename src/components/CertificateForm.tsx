// components/CertificateForm.tsx
"use client";
import { useState } from "react";
import CertificatePreview from "./CertificatePreview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Preview from "./Preview";

export default function CertificateForm() {
    const [form, setForm] = useState({
        name: "",
        year: "2024",
        certNumber: "",
        image: null as File | null,
        member: "",
    });
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, files } = e.target;
        if (files) {
            setForm({ ...form, image: files[0] });
            setPreviewURL(URL.createObjectURL(files[0]));
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // async function handleDownload() {
    //     const certElement = document.getElementById("certificate-preview");
    //     console.log(certElement);
    //     if (!certElement) return;
    //     async function saveToDatabase() {
    //         const res = await fetch("/api/certificates", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 name: form.name,
    //                 year: form.year,
    //                 certNumber: form.certNumber,
    //                 imageUrl: previewURL, // In production, you'd use Cloudinary or S3
    //             }),
    //         });

    //         if (!res.ok) {
    //             alert("Failed to save certificate");
    //         }
    //     }
    // }
    async function handleDownload() {
        console.log("Downloading PDF...");
        const certElement = document.getElementById("certificate-preview");
        console.log(certElement);
        if (!certElement) return;
        const canvas = await html2canvas(certElement);
        console.log(canvas);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [800 * 2, 600] });
        pdf.addImage(imgData, "PNG", 0, 0, 800, 600);
        // await saveToDatabase();
        pdf.save(`${form.certNumber || "certificate"}.pdf`);
    }

    return (
        <div className="flex flex-col gap-4">
            <input name="name" placeholder="Full Name" onChange={handleChange} className="border p-2" />
            <input name="certNumber" placeholder="Certificate Number" onChange={handleChange} className="border p-2" />
            <input name="year" placeholder="Year" onChange={handleChange} className="border p-2" />
            <input type="file" accept="image/*" onChange={handleChange} className="border p-2" />
            <select name="member" onChange={handleSelect} className="border p-2">
                <option value="">Select Member Type</option>
                <option value="Planner">Planner</option>
                <option value="Architect">Architect</option>
            </select>
            <button
                onClick={handleDownload}
                className="bg-blue-600 text-white p-2 rounded w-fit mt-2 hover:bg-blue-700"
            >
                Download PDF
            </button>

            <CertificatePreview {...form} imagePreview={previewURL} />
            {/* <Preview {...form} imagePreview={previewURL} /> */}
        </div>
    );
}

