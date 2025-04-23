import { prisma } from "@/lib/db";
import { endGameSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { gameId } = endGameSchema.parse(body);

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });
    if (!game) {
      return NextResponse.json(
        {
          message: "Jogo não encontrado",
        },
        {
          status: 404,
        }
      );
    }
    await prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        timeEnded: new Date(),
      },
    });
    return NextResponse.json({
      message: "Fim de jogo",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Alguma coisa deu errado",
      },
      { status: 500 }
    );
  }
}
