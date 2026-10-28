import React, { useState, useEffect } from 'react';
import { ManufacturingProcess, ManufacturingCapability } from '../types/index.ts';
import { Cog, CheckCircle, Factory, Shield, Sparkles, Truck } from 'lucide-react';

interface ManufacturingViewProps {
  onRequestEnquiry: () => void;
}

export const ManufacturingView: React.FC<ManufacturingViewProps> = ({ onRequestEnquiry }) => {
  const [processes, setProcesses] = useState<ManufacturingProcess[]>([]);
  const [capabilities, setCapabilities] = useState<ManufacturingCapability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/manufacturing/processes').then((r) => r.json()),
      fetch('/api/manufacturing/capabilities').then((r) => r.json()),
    ])
      .then(([procData, capData]) => {
        if (Array.isArray(procData)) setProcesses(procData);
        if (Array.isArray(capData)) setCapabilities(capData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#faf7f2] min-h-screen py-10 px-4 sm:px-8 space-y-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner */}
        <div className="border-b border-stone-300 pb-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#4a1122] font-semibold">
            ENGINEERING LUXURY TEXTILES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-1">
            Manufacturing & Production Capabilities
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            Take a deep look into our state-of-the-art weaving sheds, electronic Jacquard systems, computerized jet dyeing, and fabric quality inspection laboratories in Surat, India.
          </p>
        </div>

        {/* Manufacturing Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-sm space-y-3"
            >
              <div className="w-12 h-12 rounded-lg bg-[#4a1122] text-[#dfb15b] flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">{cap.title}</h3>
              {cap.metric && (
                <p className="text-xs font-mono font-bold text-[#4a1122] uppercase tracking-wider">
                  {cap.metric}
                </p>
              )}
              <p className="text-xs text-stone-600 leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>

        {/* The 5-Stage Production Timeline */}
        <div className="space-y-8">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              The 5-Stage Precision Manufacturing Cycle
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Every yard of fabric is inspected, tracked, and finished with meticulous laboratory oversight.
            </p>
          </div>

          <div className="space-y-6">
            {processes.map((proc) => (
              <div
                key={proc.id}
                className="bg-white rounded-xl border border-stone-200/90 p-6 md:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-2 flex flex-col items-center justify-center text-center p-4 bg-[#faf7f2] rounded-lg border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">STAGE</span>
                  <span className="font-serif text-4xl font-bold text-[#4a1122]">
                    {String(proc.stepNumber).padStart(2, '0')}
                  </span>
                </div>

                <div className="lg:col-span-7 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-xl text-stone-900">{proc.title}</h3>
                    {proc.highlight && (
                      <span className="px-2 py-0.5 bg-[#dfb15b]/20 text-[#4a1122] text-[10px] font-bold uppercase rounded">
                        {proc.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {proc.description}
                  </p>
                </div>

                <div className="lg:col-span-3 aspect-[16/10] rounded-lg overflow-hidden bg-[#24060d] border border-stone-200">
                  <img
                    src={proc.imageUrl}
                    alt={proc.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Callout */}
        <div className="bg-[#24060d] text-[#f7eedf] p-8 sm:p-10 rounded-xl border border-[#dfb15b]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-serif text-2xl font-bold text-white">Have a Custom Fabric Requirement?</h3>
            <p className="text-xs text-white/70">
              Need custom GSM, customized width up to 60 inches, proprietary dobby weaving, or specific flame-retardant finish? Our textile specialists are ready to assist.
            </p>
          </div>
          <button
            onClick={onRequestEnquiry}
            className="px-6 py-3 bg-[#dfb15b] hover:bg-[#ebd08f] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded transition-colors shrink-0"
          >
            CONSULT TEXTILE SPECIALISTS
          </button>
        </div>
      </div>
    </div>
  );
};
