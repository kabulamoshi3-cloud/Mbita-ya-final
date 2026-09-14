import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

/**
 * POST /api/ai/chat
 * AI chatbot for students
 * 
 * Note: Temporarily disabled due to Prisma schema issues on Render.
 * This can be re-enabled after fixing the AIConversation and AIMessage schema.
 */
export async function POST(request: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.studentId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Temporarily return a friendly message
  return NextResponse.json({
    response: "AI Assistant is temporarily unavailable. We're working on bringing it back soon! In the meantime, please contact your professor for assistance.",
    conversationId: null,
    error: "Feature temporarily disabled"
  }, { status: 503 });
}

/*
// Original implementation - Uncomment after fixing Prisma schema
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.studentId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 }
      );
    }

    // Get conversation history
    let conversation;
    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10,
          },
        },
      });
    } else {
      conversation = await prisma.aIConversation.create({
        data: {
          studentId: session.studentId,
          title: message.substring(0, 50),
        },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message,
      },
    });

    // Build messages array for OpenAI
    const messages = [
      {
        role: "system" as const,
        content: "You are a helpful AI research assistant for students."
      },
      ...conversation.messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    // Save AI response
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: aiResponse,
      },
    });

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation.id,
    });

  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
*/
