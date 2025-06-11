import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

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
    const { firstName, lastName, email, phoneNumber, address } = body;

    // Generate a unique membership ID
    const membershipId = `MEM${Date.now()}`;

    const member = await prisma.members.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        membershipId,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Error creating member" },
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

    const members = await prisma.members.findMany({
      include: {
        certificates: true,
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Error fetching members" },
      { status: 500 }
    );
  }
}
