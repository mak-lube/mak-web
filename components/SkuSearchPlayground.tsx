'use client';

import { useState, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';

type SkuSearchRow = {
  id: string;
  sku_code: string;
  name: string;
  product_group: string | null;
  viscosity_spec: string | null;
  pack_size_ltr: number | null;
  packs_per_case: number | null;
  dlp_per_pack: number | null;
};

const skeletonItems = Array.from({ length: 6 });

export default function SkuSearchPlayground() {
  const [q, setQ] = useState('Mak');
  const [grp, setGrp] = useState('');
  const [visc, setVisc] = useState('');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<SkuSearchRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.rpc('search_skus', {
      q: q.trim() || null,
      grp: grp.trim() || null,
      visc: visc.trim() || null,
      limit_rows: 20,
    });

    if (error) {
      console.error('RPC search_skus error', error);
      setError(error.message);
    } else {
      setRows((data ?? []) as SkuSearchRow[]);
    }

    setLoading(false);
  };

  const resetFilters = () => {
    setQ('');
    setGrp('');
    setVisc('');
    setRows([]);
    setError(null);
  };

  const formatPrice = (value: number | null) => {
    if (value == null) return 'Price missing';
    return `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} / pack`;
  };

  const showEmpty = !loading && !error && rows.length === 0;

  return (
    <section className="mt-10 max-w-5xl mx-auto space-y-4">
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm text-zinc-400 mb-1">
              Search text (name / code)
            </label>
            <input
              className="w-full rounded-xl px-3 py-2 bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={q}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
              placeholder="e.g. MAK 4T STAR"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm text-zinc-400 mb-1">
              Product group
            </label>
            <input
              className="w-full rounded-xl px-3 py-2 bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={grp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGrp(e.target.value)}
              placeholder="e.g. TWO WHEELER 4 STROKE"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm text-zinc-400 mb-1">Viscosity</label>
            <input
              className="w-full rounded-xl px-3 py-2 bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={visc}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setVisc(e.target.value)}
              placeholder="e.g. 10W30"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={runSearch}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-500 text-sm font-semibold hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl border border-zinc-800 text-sm text-zinc-200 hover:bg-zinc-800/60"
            >
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/40 text-red-200 px-4 py-3 text-sm flex justify-between items-start">
            <div>
              <p className="font-semibold">Error from Supabase</p>
              <p className="text-red-100/80">{error}</p>
            </div>
            <button
              onClick={runSearch}
              className="text-xs font-semibold underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <div>
          {loading
            ? 'Searching…'
            : `Showing ${rows.length} result${rows.length === 1 ? '' : 's'}`}
        </div>
        <div className="text-zinc-500">
          Cards view · up to 20 results per search
        </div>
      </div>

      {showEmpty && (
        <div className="border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/60 p-8 text-center space-y-3">
          <p className="text-lg font-semibold text-zinc-100">
            No SKUs match your filters
          </p>
          <p className="text-sm text-zinc-400">
            Try clearing filters or search a common product like “MAK 4T”.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-sm"
            >
              Clear filters
            </button>
            <button
              onClick={() => setQ('MAK 4T')}
              className="px-3 py-2 rounded-lg bg-emerald-500 text-sm font-semibold hover:bg-emerald-400"
            >
              Use sample query
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {loading
          ? skeletonItems.map((_, idx) => (
              <div
                key={idx}
                className="border border-zinc-800 bg-zinc-950 rounded-2xl p-4 animate-pulse space-y-3"
              >
                <div className="h-5 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-900 rounded w-1/2" />
                <div className="h-4 bg-zinc-900 rounded w-2/3" />
                <div className="h-6 bg-zinc-800 rounded w-1/3" />
              </div>
            ))
          : rows.map((row) => (
              <div
                key={row.id}
                className="border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900/70 rounded-2xl p-4 shadow-lg hover:translate-y-[-2px] transition-transform"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-white">
                      {row.name}
                    </div>
                    <div className="text-xs text-emerald-300 font-mono">
                      {row.sku_code}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
                      <span className="px-2 py-1 rounded-full bg-zinc-800 border border-zinc-700">
                        {row.product_group ?? 'No group'}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-zinc-800 border border-zinc-700">
                        {row.viscosity_spec ?? 'No viscosity'}
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-sm font-semibold">
                    {formatPrice(row.dlp_per_pack)}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-400">
                  <div className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                    Pack size: {row.pack_size_ltr != null ? `${row.pack_size_ltr} L` : '—'}
                  </div>
                  <div className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                    Packs / case: {row.packs_per_case ?? '—'}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}
