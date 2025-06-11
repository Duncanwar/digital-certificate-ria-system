"use client";

import { useState } from "react";

export default function VerifyCertificatePage() {
    const [verificationCode, setVerificationCode] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(
                `/api/certificates/verify?code=${verificationCode}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to verify certificate");
            }

            setResult(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Verify Certificate
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the verification code to check certificate validity
                    </p>
                </div>

                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label
                                htmlFor="verificationCode"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Verification Code
                            </label>
                            <div className="mt-1">
                                <input
                                    id="verificationCode"
                                    name="verificationCode"
                                    type="text"
                                    required
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter verification code"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify Certificate"}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="mt-6">
                            <div
                                className={`p-4 rounded-md ${result.isValid
                                        ? "bg-green-50 border border-green-400"
                                        : "bg-red-50 border border-red-400"
                                    }`}
                            >
                                <h3 className="text-lg font-medium mb-2">
                                    {result.isValid ? "Valid Certificate" : "Invalid Certificate"}
                                </h3>
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-medium">Certificate Name:</span>{" "}
                                        {result.certificate.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">Certificate Number:</span>{" "}
                                        {result.certificate.certNumber}
                                    </p>
                                    <p>
                                        <span className="font-medium">Year:</span>{" "}
                                        {result.certificate.year}
                                    </p>
                                    <p>
                                        <span className="font-medium">Status:</span>{" "}
                                        {result.certificate.status}
                                    </p>
                                    {result.certificate.expiryDate && (
                                        <p>
                                            <span className="font-medium">Expiry Date:</span>{" "}
                                            {new Date(result.certificate.expiryDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-medium">Issued By:</span>{" "}
                                        {result.certificate.issuedBy}
                                    </p>
                                    {result.certificate.member && (
                                        <>
                                            <p>
                                                <span className="font-medium">Member Name:</span>{" "}
                                                {result.certificate.member.name}
                                            </p>
                                            <p>
                                                <span className="font-medium">Membership ID:</span>{" "}
                                                {result.certificate.member.membershipId}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 