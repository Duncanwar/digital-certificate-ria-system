import MemberRegistrationForm from "@/components/MemberRegistrationForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function RegisterMemberPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const { role } = session.user as any;
    if (role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="container mx-auto py-8">
            <MemberRegistrationForm />
        </div>
    );
} 