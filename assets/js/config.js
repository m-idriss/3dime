/* =========================
   Configuration Constants
   ========================= */

export const CONFIG = {
  SUPPORTED_LANGUAGES: ['en', 'fr'],
  DEFAULT_LANGUAGE: 'en',
  FONT_SIZES: ['normal', 'large', 'small'],
  DEFAULT_FONT_SIZE: 'normal',
  DEFAULT_THEME: 'dark',
  DEFAULT_NOTIFICATIONS: 'on',
  
  FADE_TIMEOUT: 400,
  
  // API endpoints
  ENDPOINTS: {
    I18N: 'i18n',
    PROXY: 'proxy.php'
  },
  
  // DOM selectors
  SELECTORS: {
    CARDS_CONTAINER: '.cards-container',
    BURGER_BTN: '#burger-btn',
    PROFILE_DROPDOWN: '#profile-dropdown',
    THEME_TOGGLE: '#theme-toggle',
    LANGUAGE_TOGGLE: '#language-toggle',
    LANGUAGE_SUBMENU: '#language-submenu',
    NOTIFICATIONS_TOGGLE: '#notifications-toggle',
    FONT_SIZE_TOGGLE: '#font-size-toggle',
    HEATMAP_CONTAINER: '#heatmap-container'
  }
};