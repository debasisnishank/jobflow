'use client';

import Image from 'next/image';

const companies = [
  { name: "Google", domain: "google.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Apple", domain: "apple.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "Meta", domain: "meta.com" },
  { name: "Netflix", domain: "netflix.com" },
  { name: "Tesla", domain: "tesla.com" },
  { name: "Adobe", domain: "adobe.com" },
  { name: "Salesforce", domain: "salesforce.com" },
  { name: "Oracle", domain: "oracle.com" },
  { name: "IBM", domain: "ibm.com" },
  { name: "Intel", domain: "intel.com" },
  { name: "NVIDIA", domain: "nvidia.com" },
  { name: "Spotify", domain: "spotify.com" },
  { name: "Uber", domain: "uber.com" }
];

function LogoItem({ company }: { company: typeof companies[0] }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center w-32 h-20 md:w-40 md:h-24 px-4 transition-all duration-300 opacity-70 hover:opacity-100">
      <div className="w-full h-full flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 relative">
        <Image
          src={`https://logo.clearbit.com/${company.domain}`}
          alt={company.name}
          width={100}
          height={50}
          className="object-contain max-w-full max-h-full w-auto h-auto"
          unoptimized
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className = 'text-xs font-semibold text-gray-600 text-center';
              fallback.textContent = company.name;
              parent.appendChild(fallback);
            }
          }}
        />
        <span className="sr-only">{company.name}</span>
      </div>
    </div>
  );
}

export default function LogoCarousel() {
  return (
    <section className="w-full py-8 md:py-12 bg-white border-y">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden relative">
          <div 
            className="flex animate-scroll whitespace-nowrap"
            style={{
              animation: 'scroll 30s linear infinite',
            }}
          >
            {/* First set of logos */}
            {companies.map((company, i) => (
              <LogoItem key={`logo-${i}`} company={company} />
            ))}
            {/* Duplicate set for seamless loop */}
            {companies.map((company, i) => (
              <LogoItem key={`logo-duplicate-${i}`} company={company} />
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

