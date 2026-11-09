import { NextResponse } from "next/server";
import { menu } from "@/data/menu";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const menuId = Number(id);
  const item = menu.find((m) => m.id === menuId);

  if (!item) {
    return NextResponse.json(
      { pesan: "Menu tidak ditemukan" },
      { status: 404 },
    );
  }
  return NextResponse.json(item);
}
