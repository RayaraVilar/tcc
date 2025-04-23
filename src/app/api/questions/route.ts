import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { getQuestionsSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";



export const runtime = "nodejs";
export const maxDuration = 500;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, topic, type } = getQuestionsSchema.parse(body);

    let questions: any;

    if (type === "open_ended") {
      questions = Array.from({ length: amount }, (_, i) => ({
        question: `Explique brevemente o conceito de ${topic} (${i + 1}).`,
        answer: "Resposta aberta com no máximo 15 palavras."
      }));
    } else if (type === "mcq") {
      questions = Array.from({ length: amount }, (_, i) => ({
        question: `Qual das opções representa melhor o conceito de ${topic}? (${i + 1})`,
        answer: "Resposta correta",
        option1: "Opção incorreta 1",
        option2: "Opção incorreta 2",
        option3: "Opção incorreta 3"
      }));
    }

    return NextResponse.json({ questions }, { status: 200 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("elle gpt error", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
