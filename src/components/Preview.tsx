import QRCode from "react-qr-code";

interface Props {
    name: string;
    year: string;
    certNumber: string;
    image: File | null;
    imagePreview?: string | null;
}

export default function Preview({ name, year, certNumber, imagePreview }: Props) {
    const qrValue = `https://ria.org.rw/verify/${certNumber}`;

    return (
        <div
            id="certificate-preview"
            className="relative w-[800px] h-[600px] border bg-white mt-6 p-10 shadow-xl font-serif"
        >
            {/* Header */}
            <div className="absolute top-[40px] left-[300px] text-center">
                <h1 className="text-2xl font-bold text-green-700">REGISTRATION BOARD</h1>
                <p className="text-sm text-gray-600">
                    ARCHITECTS | PLANNERS | QUANTITY SURVEYORS | LAND SURVEYORS
                </p>
            </div>

            {/* Certificate Title */}
            <p className="absolute top-[150px] left-[300px] text-center font-semibold">This is to Certify that</p>
            <h2 className="absolute top-[180px] left-[250px] text-2xl font-bold">Arch. {name || "Full Name"}</h2>

            {/* Description */}
            <p className="absolute top-[230px] left-[80px] w-[640px] text-sm leading-relaxed text-justify">
                is a registered and licensed <br />
                <span className="font-bold">Architect in the year of {year || "2024"} as a professional senior corporate member</span>{" "}
                of the institute in accordance with the terms of a complying member under the Architects, Landscape Architects,
                Urban Designer and Interior Designers registration and building codes within the laws of Rwanda.
            </p>

            {/* Legal Clause */}
            <p className="absolute top-[330px] left-[80px] w-[640px] text-sm text-justify">
                In witness whereof the common seal has been here to affixed at a meeting of the{" "}
                <span className="font-bold">Board of Registration</span> and the law <br />
                <span className="font-bold">No: 26/2012 governing the profession of Architecture</span> and establishing the
                Rwanda Institute of Architects.
            </p>

            {/* QR Code */}
            <div className="absolute top-[440px] right-[60px]">
                <QRCode value={qrValue} size={80} />
            </div>

            {/* Profile Image */}
            {imagePreview && (
                <img
                    src={imagePreview}
                    alt="Profile"
                    className="absolute top-[220px] left-[20px] w-24 h-24 object-cover rounded"
                />
            )}

            {/* Certificate No. */}
            <p className="absolute bottom-[90px] left-[80px] text-sm">
                <span className="font-semibold">Registered serial No.:</span> {certNumber || "A.74.17"}
            </p>

            {/* Footer */}
            <p className="absolute bottom-[60px] left-[80px] text-sm">Arch. {name || "Full Name"}</p>
            <p className="absolute bottom-[60px] right-[80px] text-sm">Date: 20/5/2024</p>
            <p className="absolute bottom-[40px] right-[80px] text-sm">Arch. Eugene Kayumba</p>

            {/* Validity Note */}
            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center text-sm py-1">
                THIS CERTIFICATE IS VALID FOR 2025 ONLY AND IS HELD SUBJECT TO THE PROVISIONS OF BUILDING CODES AND BY LAWS
            </div>
        </div>
    );
}
