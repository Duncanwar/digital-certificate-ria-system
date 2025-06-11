import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import type { Members, Certificate } from "@/generated/prisma";

const prisma = new PrismaClient();

type CertificateWithMember = Certificate & {
    members: Members;
};

export default async function AdminOverviewPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const { role } = session.user as any;
    if (role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Get system statistics
    const [
        totalMembers,
        totalCertificates,
        recentMembers,
        recentCertificates,
    ] = await Promise.all([
        prisma.members.count(),
        prisma.certificate.count(),
        prisma.members.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
        }),
        prisma.certificate.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                members: true,
            },
        }),
    ]);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">System Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Members</h2>
                    <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Total Certificates</h2>
                    <p className="text-3xl font-bold text-green-600">{totalCertificates}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Members</h2>
                    <div className="space-y-4">
                        {recentMembers.map((member: Members) => (
                            <div key={member.id} className="border-b pb-4 last:border-b-0">
                                <p className="font-medium">
                                    {member.firstName} {member.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{member.email}</p>
                                <p className="text-sm text-gray-500">
                                    Joined: {new Date(member.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Certificates</h2>
                    <div className="space-y-4">
                        {recentCertificates.map((cert: CertificateWithMember) => (
                            <div key={cert.id} className="border-b pb-4 last:border-b-0">
                                <p className="font-medium">{cert.name}</p>
                                <p className="text-sm text-gray-600">
                                    Certificate #: {cert.certNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Issued: {new Date(cert.createdAt).toLocaleDateString()}
                                </p>
                                {cert.members && (
                                    <p className="text-sm text-gray-500">
                                        Member: {cert.members.firstName} {cert.members.lastName}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 