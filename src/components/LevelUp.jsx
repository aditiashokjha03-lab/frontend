import { motion, AnimatePresence } from 'framer-motion';

export default function LevelUp({ level }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.5, rotate: 10 }}
                transition={{ type: "spring", damping: 15 }}
                className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            >
                <div className="bg-card border-4 border-primary p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center">
                    <div className="text-6xl animate-bounce">🏆</div>
                    <h2 className="text-4xl font-extrabold text-foreground animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                        Level Up!
                    </h2>
                    <p className="text-xl font-bold text-muted-foreground">
                        You've reached Level {level}!
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
