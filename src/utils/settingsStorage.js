// ============================================================
// LocalStorage Helper Functions
// Settings save/load karnyasathi
// ============================================================

const STORAGE_KEY = 'netdiag_settings';

// ============================================================
// DEFAULT SETTINGS
// ============================================================
export const DEFAULT_SETTINGS = {
    user: {
        name: 'Admin User',
        email: 'admin@netdiag.com',
    },
    diagnostic: {
        timeout: 10,
        retryAttempts: 2,
        serverRegion: 'Asia',
    },
    workflow: {
        roblox: {
            websiteLoad: true,
            loginCheck: true,
            playButton: true,
            clientLaunch: true,
            studioLoad: true,
        },
        testrail: {
            website: true,
            testCaseLoad: true,
            execution: true,
        },
    },
    ui: {
        theme: 'dark',
        animations: true,
        notifications: true,
    },
    reports: {
        autoSave: true,
        detailedLogs: false,
        exportFormat: 'JSON',
    },
};

// ============================================================
// LOAD SETTINGS - localStorage madhun load kara
// ============================================================
export const loadSettings = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            console.log('✅ Settings loaded from localStorage:', parsed);
            return parsed;
        }
    } catch (error) {
        console.error('❌ Settings load error:', error);
    }
    console.log('ℹ️ Using default settings');
    return DEFAULT_SETTINGS;
};

// ============================================================
// SAVE SETTINGS - localStorage madhe save kara
// ============================================================
export const saveSettings = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        console.log('✅ Settings saved to localStorage:', settings);
        return true;
    } catch (error) {
        console.error('❌ Settings save error:', error);
        return false;
    }
};

// ============================================================
// RESET SETTINGS - default var reset kara
// ============================================================
export const resetSettings = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✅ Settings reset to default');
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.error('❌ Settings reset error:', error);
        return DEFAULT_SETTINGS;
    }
};