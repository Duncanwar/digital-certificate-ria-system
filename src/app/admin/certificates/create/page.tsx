"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateCertificatePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            year: formData.get("year"),
            certNumber: formData.get("certNumber"),
            memberId: formData.get("memberId"),
            description: formData.get("description"),
            category: formData.get("category"),
            expiryDate: formData.get("expiryDate"),
            issuedBy: session?.user?.name || "System",
        };

        try {
            const response = await fetch("/api/certificates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to create certificate");
            }

            router.push("/admin/certificates");
            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Create New Certificate</h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                    {error && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Certificate Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                Year
                            </label>
                            <input
                                type="text"
                                name="year"
                                id="year"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="certNumber" className="block text-sm font-medium text-gray-700">
                                Certificate Number
                            </label>
                            <input
                                type="text"
                                name="certNumber"
                                id="certNumber"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
                            Member ID
                        </label>
                        <input
                            type="text"
                            name="memberId"
                            id="memberId"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            name="expiryDate"
                            id="expiryDate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Certificate"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 