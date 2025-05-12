import QRCode from "react-qr-code";

interface Props {
    name: string;
    year: string;
    certNumber: string;
    image: File | null;
    imagePreview?: string | null;
}

export default function CertificatePreview({ name, year, certNumber, imagePreview }: Props) {
    const qrValue = `https://ria.org.rw/verify/${certNumber}`;

    return (
        <div className="relative w-[800px] h-[600px] border bg-white mt-6 p-10 shadow-xl">
            {/* Name */}
            <h2 className="absolute top-[200px] left-[150px] text-2xl font-bold">Arch. {name}</h2>

            {/* Year */}
            <p className="absolute top-[250px] left-[150px]">Architect in the year of {year}</p>

            {/* Cert Number */}
            <p className="absolute top-[300px] left-[150px]">Certificate No: {certNumber}</p>

            {/* QR Code */}
            <div className="absolute top-[350px] right-[100px]">
                <QRCode value={qrValue} size={100} />
            </div>

            {/* Image */}
            {imagePreview && (
                <img src={imagePreview} alt="Profile" className="absolute top-[150px] left-[50px] w-24 h-24 object-cover" />
            )}

            {/* Placeholder seals, logos, etc. would go here */}
        </div>
    );
}
