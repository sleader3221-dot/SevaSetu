import SchemeDetailClient from "@/components/SchemeDetailClient";

export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function SchemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <SchemeDetailClient id={resolvedParams.id} />;
}