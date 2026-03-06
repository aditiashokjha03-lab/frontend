import React from 'react';

const LevelUp = ({ level }) => {
    if (!level) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-card text-card-foreground rounded-2xl px-8 py-10 shadow-2xl max-w-sm w-full text-center animate-pulse">
                <h2 className="text-3xl font-extrabold mb-2">LEVEL UP 🎉</h2>
                <p className="text-lg">You reached Level {level}</p>
            </div>
        </div>
    );
};

export default LevelUp;

