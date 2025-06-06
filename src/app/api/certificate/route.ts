import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { name, year, certNumber, imageUrl } = body;

  try {
    const certificate = await prisma.certificate.create({
      data: { name, year, certNumber, imageUrl },
    });
    return new Response(JSON.stringify(certificate), { status: 201 });
  } catch (err) {
    return new Response("Error saving certificate", { status: 500 });
  }
}
