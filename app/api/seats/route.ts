import { prisma } from "@/lib/prisma";

export async function GET() {
  const seats = await prisma.seat.findMany({
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          association: true,
        },
      },
    },
  });

  return Response.json(seats);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { seatId, username } = body;
  const seatTest= await prisma.seat.findUnique({
    where: {ownerId: username},
  });
  if (seatTest != null){
  const updateSeat = await prisma.seat.update({
    where: { ownerId: username },
    data: { ownerId: null },
  });
}
  const updateSeat2 = await prisma.seat.update({
    where: { id: seatId },
    data: { ownerId: username },
  });
  return Response.json(updateSeat2);
}