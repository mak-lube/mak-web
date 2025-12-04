'use client';

import { useState } from 'react';
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
    setRows([]);

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
      console.log('search_skus result', data);
      setRows((data ?? []) as SkuSearchRow[]);
    }

    setLoading(false);
  };

  const formatPrice = (value: number | null) => {
    if (value == null) {
      return 'No DLP set for this SKU';
    }
    return `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} per pack`;
  };

  return (
    <section className="mt-10 max-w-4xl mx-auto">
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          SKU Search Playground (Supabase RPC)
        </h2>

        <p className="text-sm text-zinc-400 mb-4">
          Type a part of the name or code, and optionally filter by product
          group / viscosity. Results come from the <code>search_skus</code>{' '}
          RPC in Supabase.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1">
              Search text (name / code)
            </label>
            <input
              className="w-full rounded-lg px-3 py-2 bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. MAK 4T STAR"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Product group (optional)
            </label>
            <input
              className="w-full rounded-lg px-3 py-2 bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={grp}
              onChange={(e) => setGrp(e.target.value)}
              placeholder="e.g. TWO WHEELER 4 STROKE"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Viscosity (optional)
            </label>
            <input
              className="w-full rounded-lg px-3 py-2 bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={visc}
              onChange={(e) => setVisc(e.target.value)}
              placeholder="e.g. 10W30"
            />
          </div>
        </div>

        <button
          onClick={runSearch}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-500 text-sm font-medium hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Run search'}
        </button>

        {error && (
          <p className="text-sm text-red-400 mt-3">
            Error from Supabase: {error}
          </p>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">
            Results ({rows.length})
          </h3>

          {rows.length === 0 && !loading && !error && (
            <p className="text-sm text-zinc-400">
              No results yet. Try a search above.
            </p>
          )}

          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="font-medium">
                      {row.name}{' '}
                      <span className="text-xs text-zinc-500">
                        [{row.sku_code}]
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      Group: {row.product_group ?? '—'} | Viscosity:{' '}
                      {row.viscosity_spec ?? '—'}
                    </div>
                    <div className="text-xs text-zinc-400">
                      Pack size:{' '}
                      {row.pack_size_ltr != null
                        ? `${row.pack_size_ltr} L`
                        : '—'}{' '}
                      | Packs / case:{' '}
                      {row.packs_per_case != null
                        ? row.packs_per_case
                        : '—'}
                    </div>
                  </div>

                  <div className="text-right text-sm font-semibold">
                    {formatPrice(row.dlp_per_pack)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
