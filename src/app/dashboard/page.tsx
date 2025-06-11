import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import type { Certificate } from "@/generated/prisma";

const prisma = new PrismaClient();

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const { role } = session.user as any;
    const isAdmin = role === "ADMIN";

    // Get user's certificates if they're a member
    const certificates = role === "MEMBER"
        ? await prisma.certificate.findMany({
            where: {
                members: {
                    email: session.user?.email as string,
                },
            },
        })
        : [];

    return (
        <div className="container mx-auto py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Welcome, {session.user?.name}!</h2>
                    <p className="text-gray-600">Role: {role}</p>
                </div>

                {isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Member Management</h3>
                            <p className="text-gray-600 mb-4">Manage members and their certificates</p>
                            <a
                                href="/members"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View Members →
                            </a>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Register New Member</h3>
                            <p className="text-gray-600 mb-4">Add new members to the system</p>
                            <a
                                href="/members/register"
                                className="text-green-600 hover:text-green-800 font-medium"
                            >
                                Register Member →
                            </a>
                        </div>

                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">System Overview</h3>
                            <p className="text-gray-600 mb-4">View system statistics and reports</p>
                            <a
                                href="/admin/overview"
                                className="text-purple-600 hover:text-purple-800 font-medium"
                            >
                                View Overview →
                            </a>
                        </div>
                    </div>
                )}

                {role === "MEMBER" && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Your Certificates</h2>
                        {certificates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {certificates.map((cert: Certificate) => (
                                    <div key={cert.id} className="bg-white border rounded-lg p-4 shadow-sm">
                                        <h3 className="font-semibold">{cert.name}</h3>
                                        <p className="text-gray-600">Year: {cert.year}</p>
                                        <p className="text-gray-600">Certificate #: {cert.certNumber}</p>
                                        <a
                                            href={`/certificates/${cert.id}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                                        >
                                            View Certificate →
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">You don't have any certificates yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 