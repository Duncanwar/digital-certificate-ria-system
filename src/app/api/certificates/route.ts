import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = session.user as any;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      year,
      certNumber,
      memberId,
      description,
      category,
      expiryDate,
      issuedBy,
    } = body;

    // Generate a unique verification code
    const verificationCode = nanoid(10);

    const certificate = await prisma.certificate.create({
      data: {
        name,
        year,
        certNumber,
        memberId,
        description,
        category,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        issuedBy,
        verificationCode,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: "Error creating certificate" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = session.user as any;
    const certificates = await prisma.certificate.findMany({
      include: {
        members: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Error fetching certificates" },
      { status: 500 }
    );
  }
}
