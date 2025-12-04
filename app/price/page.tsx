import SkuSearchPlayground from "@/components/SkuSearchPlayground";

export default function PricePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-16">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Price Lookup – MAK Lube
        </h1>

        <p className="text-neutral-300 text-center mb-8">
          Search by name, product group and viscosity to get current DLP prices.
        </p>

        <SkuSearchPlayground />
      </div>
    </main>
  );
}
