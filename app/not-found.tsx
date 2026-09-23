import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-md bg-white p-8">
      <h1 className="text-2xl font-semibold">We could not find that page</h1>
      <Link href="/" className="mt-3 inline-block text-[#1a5276]">
        Back to Northline
      </Link>
    </div>
  );
}
