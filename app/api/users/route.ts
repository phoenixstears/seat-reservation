import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  const body = await req.json();
  const { username } = body;
  const userTest = await prisma.user.findUnique({
    where: {id: username},
  });
  if (userTest == null){
  const user = await prisma.user.create({
    data: {
        id: username,
        username: username,
        association: "Free"
    }
  });
  console.log('12');
  return Response.json(user);
} else{
  console.log('24');
  return Response.json(userTest);
}
 
}