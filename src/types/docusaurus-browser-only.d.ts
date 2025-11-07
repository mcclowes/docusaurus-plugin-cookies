declare module '@docusaurus/BrowserOnly' {
  export interface Props {
    children?: () => JSX.Element
    fallback?: JSX.Element
  }

  export default function BrowserOnly(props: Props): JSX.Element | null
}
