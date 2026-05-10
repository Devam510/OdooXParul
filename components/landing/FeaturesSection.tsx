import { Calendar, CheckCircle2, Map, Wallet, Users, Sparkles } from "lucide-react";

const features = [
  {
    name: "Collaborative Planning",
    description: "Invite friends to your trip. Plan together in real-time, vote on activities, and share responsibilities seamlessly.",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    name: "Smart Itineraries",
    description: "Organize your days with drag-and-drop ease. Get AI-powered suggestions for missing spots in your schedule.",
    icon: Calendar,
    color: "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
  },
  {
    name: "Expense Splitting",
    description: "Track every penny spent. Traveloop automatically calculates who owes what, making group travel drama-free.",
    icon: Wallet,
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
  {
    name: "Interactive Maps",
    description: "Visualize your entire journey. See your saved places, hotels, and daily routes on a beautifully integrated map.",
    icon: Map,
    color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  },
  {
    name: "Packing Lists",
    description: "Never forget a charger again. Create shared or personal packing lists with smart weather-based suggestions.",
    icon: CheckCircle2,
    color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  },
  {
    name: "AI Travel Assistant",
    description: "Stuck on what to do? Ask the AI to generate a custom day plan based on your interests and budget.",
    icon: Sparkles,
    color: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
  },
];

export default function FeaturesSection() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-teal-600 dark:text-teal-400">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            No more scattered spreadsheets.
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Traveloop brings your group chats, messy spreadsheets, and endless browser tabs into one beautifully organized workspace.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col group">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-zinc-900 dark:text-white">
                  <div className={`h-12 w-12 flex items-center justify-center rounded-xl ${feature.color} transition-transform group-hover:scale-110`}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
