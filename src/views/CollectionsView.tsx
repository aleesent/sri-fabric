import React, { useState, useEffect } from 'react';
import { Collection, Fabric } from '../types/index.ts';
import { FabricCard } from '../components/FabricCard.tsx';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CollectionsViewProps {
  onViewFabric: (slug: string) => void;
  onRequestEnquiry: (fabricName?: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  onViewFabric,
  onRequestEnquiry,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCol, setSelectedCol] = useState<Collection | null>(null);
  const [collectionFabrics, setCollectionFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCollections(data);
          if (data.length) setSelectedCol(data[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCol) return;
    fetch(`/api/fabrics?collection=${selectedCol.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCollectionFabrics(data);
      })
      .catch((err) => console.error(err));
  }, [selectedCol]);

  return (
    <div className="bg-[#faf7f2] min-h-screen py-10 px-4 sm:px-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="border-b border-stone-300 pb-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#4a1122] font-semibold">
            CURATED TEXTILE ANTHOLOGIES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Fabric Collections
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Our signature capsules harmonize traditional heritage weave disciplines with modern silhouettes for fashion houses, couture ateliers, and international runway labels.
          </p>
        </div>

        {/* Collection Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {collections.map((col) => {
            const isSelected = selectedCol?.id === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setSelectedCol(col)}
                className={`px-5 py-3 rounded-lg text-xs font-serif font-bold tracking-wider uppercase transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#4a1122] text-[#f7eedf] shadow-md border-b-2 border-[#dfb15b]'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {col.name}
              </button>
            );
          })}
        </div>

        {/* Featured Collection Highlight Hero */}
        {selectedCol && (
          <div className="bg-[#2a0610] text-[#f7eedf] rounded-xl overflow-hidden border border-[#dfb15b]/30 shadow-xl grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-[#dfb15b] text-xs font-semibold uppercase tracking-[0.25em]">
                  {selectedCol.tagline || 'CURATED COLLECTION'}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  {selectedCol.name}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
                  {selectedCol.description}
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onRequestEnquiry(`Collection: ${selectedCol.name}`)}
                  className="px-6 py-2.5 bg-[#dfb15b] hover:bg-[#ebd08f] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  REQUEST COLLECTION SWATCH BOOK
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto overflow-hidden bg-black/40">
              <img
                src={selectedCol.imageUrl}
                alt={selectedCol.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        )}

        {/* Fabrics Inside Selected Collection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Fabrics in {selectedCol?.name || 'Collection'}
            </h3>
            <span className="text-xs text-stone-500">
              {collectionFabrics.length} Available Yardages
            </span>
          </div>

          {collectionFabrics.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-lg border border-stone-200 p-8 space-y-3">
              <p className="text-stone-500 text-xs">
                No individual fabrics currently filtered for this collection.
              </p>
              <button
                onClick={() => onRequestEnquiry(`Custom Weave for ${selectedCol?.name}`)}
                className="px-5 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-semibold rounded"
              >
                Inquire About Custom Production
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collectionFabrics.map((fabric) => (
                <FabricCard
                  key={fabric.id}
                  fabric={fabric}
                  onViewDetails={onViewFabric}
                  onRequestEnquiry={onRequestEnquiry}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
