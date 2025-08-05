import { type NextRequest, NextResponse } from "next/server"

// CORREÇÃO: Adicionada uma barra (/) no final da URL
const FASTAPI_BACKEND_URL = "http://localhost:8000/api/v1/generate/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { user_prompt, creative_mode, context } = body;
    if (!user_prompt || !creative_mode || !context) {
      return NextResponse.json(
        { success: false, error: "Parâmetros obrigatórios ausentes: user_prompt, creative_mode, ou context." },
        { status: 400 }
      );
    }

    console.log("Encaminhando para o FastAPI o corpo completo:", JSON.stringify(body));
    
    const fastapiResponse = await fetch(FASTAPI_BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await fastapiResponse.json();

    if (!fastapiResponse.ok) {
      console.error("Erro do backend FastAPI:", fastapiResponse.status, result.detail || result);
      return NextResponse.json(
        { success: false, error: `Erro do backend: ${result.detail || "Erro desconhecido"}` },
        { status: fastapiResponse.status }
      );
    }
    
    const frontendResponse = {
      success: true,
      images: [{
          url: result.image_url,
          width: 1024,
          height: 1024,
      }],
      metadata: {
        prompt_used: result.prompt_used,
        seed: result.seed
      }
    };
    
    return NextResponse.json(frontendResponse);

  } catch (error) {
    console.error("Erro na rota /api/generate:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json(
        { success: false, error: `A geração falhou: ${errorMessage}` },
        { status: 500 }
    );
  }
}