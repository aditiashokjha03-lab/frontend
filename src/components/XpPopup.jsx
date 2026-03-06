import React from 'react';

const XpPopup = ({ xp }) => {
    if (!xp) return null;

    return (
        <div className="fixed top-6 right-6 z-40">
            <div className="rounded-xl bg-primary text-primary-foreground shadow-xl px-4 py-2 flex items-center gap-2 animate-bounce">
                <span className="text-lg font-bold">+{xp} XP</span>
            </div>
        </div>
    );
};

export default XpPopup;

