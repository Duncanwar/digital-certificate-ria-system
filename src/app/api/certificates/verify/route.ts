import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const verificationCode = searchParams.get("code");

    if (!verificationCode) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode },
      include: {
        members: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Check if certificate is expired
    const isExpired = certificate.expiryDate
      ? new Date(certificate.expiryDate) < new Date()
      : false;

    // Check if certificate is revoked
    const isRevoked = certificate.status === "REVOKED";

    return NextResponse.json({
      isValid: !isExpired && !isRevoked,
      certificate: {
        name: certificate.name,
        certNumber: certificate.certNumber,
        year: certificate.year,
        status: certificate.status,
        expiryDate: certificate.expiryDate,
        issuedBy: certificate.issuedBy,
        member: certificate.members
          ? {
              name: `${certificate.members.firstName} ${certificate.members.lastName}`,
              membershipId: certificate.members.membershipId,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { error: "Error verifying certificate" },
      { status: 500 }
    );
  }
}
