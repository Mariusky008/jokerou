import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ShopButton() {
  return (
    <Link href="/shop">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-colors"
      >
        <span>🛍️</span>
        <span>Boutique</span>
      </motion.div>
    </Link>
  );
} 