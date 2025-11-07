declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module 'docusaurus-plugin-cookie-consent/client' {
  export * from 'docusaurus-plugin-cookie-consent/dist/client/CookieContext.js'
  export { default } from 'docusaurus-plugin-cookie-consent/dist/client/index.js'
}

