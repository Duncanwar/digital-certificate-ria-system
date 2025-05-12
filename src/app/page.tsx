// app/page.tsx (Entry Point)
import CertificateForm from "@/components/CertificateForm";

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-black-100">
      <h1 className="text-3xl font-bold mb-4">Certificate Generator</h1>
      <CertificateForm />
    </main>
  );
}