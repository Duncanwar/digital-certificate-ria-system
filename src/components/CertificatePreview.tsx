// components/CertificatePreview.tsx
import Image from "next/image";
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
      <h2 className="absolute top-[410px] left-[390px] text-2xl font-bold text-black">
        Arch. {name}
      </h2>
      {/* <div className="text-center mb-8 leading-relaxed">
        <p className="text-base text-black-700 mb-2">is a registered and licensed</p>
        <p className="text-base text-black-700 mb-2">
          <span className="font-semibold">Architect in the year of 2017 as a professional senior corporate member</span> of the institute in accordance with
        </p>
        <p className="text-base text-black-700 mb-4">
          the terms of a complying member under the Architects, Landscape Architects, Urban Designer and
        </p>
        <p className="text-base text-black-700 mb-6">
          Interior Designers registration and building codes within the laws of Rwanda.
        </p>

        <p className="text-sm text-black-600 mb-2">
          In witness whereof the common seal has been here to affixed at a meeting of <span className="font-semibold">the Board of Registration and the law</span>
        </p>
        <p className="text-sm text-black-600">
          <span className="font-semibold">N°: 26/2012 governing the profession of Architecture</span> and establishing the Rwanda Institute of Architects.
        </p>
      </div> */}
      <p className=" absolute top-[460px]  left-[400px] right-[400px] text-center  text-black  text-sm" >is a registered and licensed</p>
      <p className="absolute top-[480px] left-[210px] text-sm text-black">
        <span className="font-bold">Architect in the year of {year} as a Professional Chartered Member</span> of
        the Institute
        in accordance with <br />the terms of a complying member under the Architects, Landscape Arch itects, Urban Designers, and <br></br>
        <span className="text-center">Interior Designers registration and building codes within the laws of Rwanda.</span>
      </p>

      <p className="absolute top-[550px] left-[210px] text-sm text-black">
        In witness whereof the common seal has been here to affixed at a meeting of the
        <span className="font-bold"> Board of Registration and the law</span><br></br>
        <span className="font-bold">No: 26/2012 governing the profession of Architecture </span> and establishing the Rwanda Institute of Architects.</p>
      {/* <p className="absolute top-[370px] left-[390px] text-black">
  Certificate No: {certNumber}
</p> */}

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Profile"
          className="absolute top-[470px] left-[100px] w-[100px] h-[100px] object-cover rounded"
        />
      )}
      <span className="absolute top-[605px] left-[220px] text-sm text-black">A.134</span>
      <span className="absolute top-[635px] left-[115px] text-sm text-black">
        <img src="/sign_emm.png" alt="Signature Emmanuel" className="w-[100px] h-auto" />
      </span>      <span className="absolute top-[670px] left-[110px] text-xs text-black">Arch. Emmanuel Nyirinkindi</span>
      <span className="absolute top-[620px] left-[255px] text-sm text-black">
        <img src="/bg_RIA.png" alt="Signature Eudes" className="w-[100px] h-auto" />
      </span>
      <div className="absolute top-[465px] right-[50px]">
        <QRCode value={qrValue} size={100} />
      </div>
      <span className="absolute top-[605px] right-[160px] text-md text-black">20/05/2025</span>
      <span className="absolute top-[635px] right-[115px] text-sm text-black">
        <img src="/sign_eu.png" alt="Signature Eudes" className="w-[100px] h-auto" />
      </span>

      <span className="absolute top-[670px] right-[140px] text-xs text-black">Arch. Eudes Kayumba</span>
      <span className="absolute top-[570px] right-[40px] text-sm text-black">
        <img src="/bg_RB.png" alt="Signature Eudes" className="w-[150px] h-auto" />
      </span>
      <p className="absolute top-[720px] left-0 right-0 text-white text-center py-1 font-bold" style={{ fontSize: 10.5 }}>
        THIS CERTIFICATE IS VALID FOR {new Date().getFullYear()} ONLY AND IS HELD SUBJECT TO THE PROVISIONS OF BUILDING CODES AND BY LAWS
      </p>
    </div>
  );
}


{/* Overlay text and QR code here */ }
// </div>

