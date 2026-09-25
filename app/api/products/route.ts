import { NextResponse } from "next/server";
import { searchRecord } from "@/lib/api";
import { listProductCards } from "@/lib/queries";
import { parseSearchFilters } from "@/lib/search-params";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const filters = parseSearchFilters(searchRecord(new URL(request.url).searchParams));
  return NextResponse.json(await listProductCards(filters));
}
