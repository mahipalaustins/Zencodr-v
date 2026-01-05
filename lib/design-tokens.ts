// Design tokens extracted from ZenCodr home page
export const colors = {
    // Backgrounds
    bgPrimary: '#0a0e27',
    bgSecondary: '#1a1f3a',
    bgElevated: '#252b4a',
    bgHover: '#2d3454',

    // Accents
    cyan: '#00d4ff',
    cyanDark: '#00a8cc',
    purple: '#a855f7',
    purpleDark: '#8b3fd9',
    magenta: '#ff00ff',

    // Text
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',

    // Borders
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(0, 212, 255, 0.3)',
};

export const gradients = {
    primary: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
    accent: 'linear-gradient(135deg, #ff00ff 0%, #00d4ff 100%)',
    subtle: 'linear-gradient(180deg, rgba(0, 212, 255, 0.1) 0%, transparent 100%)',
    glow: 'radial-gradient(circle at center, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
};

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(0, 212, 255, 0.3)',
    glowPurple: '0 0 20px rgba(168, 85, 247, 0.3)',
};

export const animations = {
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionSlow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};
