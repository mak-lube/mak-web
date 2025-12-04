import TestSupabaseConnection from "@/components/TestSupabaseConnection";
import SkuSearchPlayground from "@/components/SkuSearchPlayground";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          MAK Lube Field Dashboard — Dev Check
        </h1>

        <p className="text-neutral-300 text-center mb-8">
          Temporary developer page to verify Supabase connectivity and SKU
          search before we build the full UI.
        </p>

        <div className="space-y-8">
          {/* 1. Simple connectivity check */}
          <TestSupabaseConnection />

          {/* 2. Search playground using search_skus RPC */}
          <SkuSearchPlayground />
        </div>
      </div>
    </main>
  );
}
