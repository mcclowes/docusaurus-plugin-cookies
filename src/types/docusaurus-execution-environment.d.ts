declare module '@docusaurus/ExecutionEnvironment' {
  const ExecutionEnvironment: {
    canUseDOM: boolean
  }

  export default ExecutionEnvironment
}

declare module '@theme-original/Root' {
  import type { ComponentType, PropsWithChildren } from 'react'

  const Root: ComponentType<PropsWithChildren>
  export default Root
}
