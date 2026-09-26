import { NextResponse } from "next/server";
import { listBrands } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const category = new URL(request.url).searchParams.get("category")?.trim() || undefined;
  return NextResponse.json(await listBrands(category));
}
