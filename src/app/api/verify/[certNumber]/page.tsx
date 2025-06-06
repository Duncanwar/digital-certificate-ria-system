import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function VerifyPage({ params }: { params: { certNumber: string } }) {
    const cert = await prisma.certificate.findUnique({
        where: { certNumber: params.certNumber },
    });

    if (!cert) return <p className="p-4">Certificate not found.</p>;

    return (
        <div className="p-8 bg-white rounded shadow-md max-w-xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Certificate Verified ✅</h1>
            <p><strong>Name:</strong> {cert.name}</p>
            <p><strong>Year:</strong> {cert.year}</p>
            <p><strong>Certificate No:</strong> {cert.certNumber}</p>
            {cert.imageUrl && <img src={cert.imageUrl} className="mt-4 w-32 h-32 object-cover" />}
        </div>
    );
}
