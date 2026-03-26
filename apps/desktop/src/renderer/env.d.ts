/// <reference types="electron-vite/node" />

declare module "*.css" {}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<
        React.HTMLAttributes<Electron.WebviewTag> & {
          src?: string;
          partition?: string;
          allowpopups?: string;
          httpreferrer?: string;
          useragent?: string;
        },
        Electron.WebviewTag
      >;
    }
  }
}
