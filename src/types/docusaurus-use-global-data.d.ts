declare module '@docusaurus/useGlobalData' {
  type GlobalData = {
    [pluginName: string]: {
      default?: unknown
      [key: string]: unknown
    }
  }

  export default function useGlobalData(): GlobalData
}


