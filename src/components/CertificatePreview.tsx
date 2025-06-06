// components/CertificatePreview.tsx
import QRCode from "react-qr-code";

interface Props {
  name: string;
  year: string;
  certNumber: string;
  image: File | null;
  imagePreview?: string | null;
  member: string;
}

export default function CertificatePreview({ name, year, certNumber, imagePreview, member }: Props) {
  const qrValue = `https://ria.org.rw/verify/${certNumber}`;

  return (
    <div
      id="certificate-preview"
      className="relative w-[1123px] h-[794px] bg-white shadow-xl"
      style={{
        backgroundImage: "url('/TemplateRIA.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="absolute top-[400px] left-[425px] text-2xl font-bold text-black">
        Arch. {name}
      </h2>

      <p className="absolute top-[500px] left-[200px] text-black">
        <span className="font-bold">Architect in the year of {year} as a Professional Chartered Member</span>
        as a  of the Institute,
        in accordance with the terms of a complying member under the Architects, <br></br>Landscape Arch itects, Urban Designers, and Interior Designers registration and building codes within the laws of Rwanda.
      </p>

      {/* <p className="absolute top-[370px] left-[390px] text-black">
  Certificate No: {certNumber}
</p> */}

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Profile"
          className="absolute top-[270px] left-[130px] w-[100px] h-[100px] object-cover rounded"
        />
      )}

      <div className="absolute top-[465px] right-[95px]">
        <QRCode value={qrValue} size={100} />
      </div>
    </div>
  );
}


{/* Overlay text and QR code here */ }
// </div>

