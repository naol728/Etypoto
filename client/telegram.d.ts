export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;

        ready: () => void;
        expand: () => void;

        requestContact: (callback: (shared: boolean) => void) => void;
      };
    };
  }
}
