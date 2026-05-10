import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <div className="relative isolate overflow-hidden bg-zinc-900 dark:bg-zinc-950 px-6 py-24 text-center sm:px-16 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.1),rgba(255,255,255,0))]"></div>
      
      <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Ready for your next adventure?
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
        Join thousands of travelers who use Traveloop to plan stress-free, unforgettable trips. It only takes a minute to get started.
      </p>
      
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/signup"
          className="rounded-full bg-teal-500 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 transition-all hover:scale-105 flex items-center gap-2 group"
        >
          Create your free account
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
        <defs>
          <radialGradient id="gradient">
            <stop stopColor="#0d9488" />
            <stop offset={1} stopColor="#312e81" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
