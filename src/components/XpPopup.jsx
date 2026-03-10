import { motion, AnimatePresence } from 'framer-motion';

export default function XpPopup({ xp }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                className="fixed bottom-10 right-10 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-xl border-2 border-primary/20 flex items-center gap-2"
            >
                <span className="text-xl">✨</span>
                +{xp} XP
            </motion.div>
        </AnimatePresence>
    );
}
