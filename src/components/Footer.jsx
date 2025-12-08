import { Heart } from "lucide-react";

export default function Footer() {
  const today = new Date();
  return (
    <footer className="bg-gray-900 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400 text-sm">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-400" /> for the
            MagicCraft Community
          </p>
          <p className="mt-2">
            © {today.getFullYear()} MagicCraft Teammate Finder. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
