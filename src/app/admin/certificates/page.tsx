import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import type { Certificate } from "@/generated/prisma";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function CertificatesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const { role } = session.user as any;
    if (role !== "ADMIN") {
        redirect("/dashboard");
    }

    const certificates = await prisma.certificate.findMany({
        include: {
            members: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Certificate Management</h1>
                <Link
                    href="/admin/certificates/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create New Certificate
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Certificate Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Member
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {certificates.map((cert: Certificate & { members: any }) => (
                            <tr key={cert.id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {cert.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Certificate #: {cert.certNumber}
                                    </div>
                                    <div className="text-sm text-gray-500">Year: {cert.year}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {cert.members ? (
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {cert.members.firstName} {cert.members.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {cert.members.membershipId}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">Not assigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cert.status === "ACTIVE"
                                                ? "bg-green-100 text-green-800"
                                                : cert.status === "REVOKED"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {cert.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <Link
                                        href={`/admin/certificates/${cert.id}`}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/admin/certificates/${cert.id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            // Handle revoke action
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Revoke
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 