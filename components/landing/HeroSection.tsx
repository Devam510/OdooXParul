import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-zinc-50 dark:bg-black">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse-slow"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 text-sm font-medium mb-8 ring-1 ring-inset ring-teal-600/20">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Travel Planning</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8">
          Plan Smarter. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">
            Travel Better.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
          Your ultimate travel companion. Organize itineraries, track shared expenses, 
          manage packing lists, and get AI-powered recommendations—all in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-full transition-all flex items-center justify-center gap-2 hover:gap-3 group shadow-xl"
          >
            Start Planning Free
            <ArrowRight className="h-5 w-5 transition-all group-hover:translate-x-1" />
          </Link>
          
          <Link
            href="/explore/cities"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-all border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 hover:shadow-md"
          >
            <MapPin className="h-5 w-5" />
            Explore Destinations
          </Link>
        </div>

        {/* Floating UI Elements Preview */}
        <div className="mt-20 sm:mt-24 relative max-w-5xl mx-auto">
          <div className="rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden ring-1 ring-zinc-900/5 dark:ring-white/10">
            <div className="rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 aspect-[16/9] relative">
              {/* Abstract App Mockup */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 flex flex-col">
                {/* Header Mock */}
                <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20"></div>
                  <div className="w-32 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="ml-auto w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
                {/* Body Mock */}
                <div className="flex-1 flex p-6 gap-6">
                  {/* Sidebar */}
                  <div className="hidden sm:flex w-48 flex-col gap-4">
                    <div className="w-full h-8 rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="w-3/4 h-8 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50"></div>
                    <div className="w-5/6 h-8 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50"></div>
                  </div>
                  {/* Main Content */}
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="w-1/3 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="flex gap-4">
                      <div className="flex-1 h-32 rounded-xl bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border border-teal-500/20"></div>
                      <div className="flex-1 h-32 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50"></div>
                      <div className="flex-1 h-32 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50"></div>
                    </div>
                    <div className="flex-1 rounded-xl bg-zinc-200/30 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
