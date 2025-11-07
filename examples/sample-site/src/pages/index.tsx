import React from 'react'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import CookiePreferenceDemo from '../components/CookiePreferenceDemo.js'

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Cookie Consent Demo"
      description="An example Docusaurus site that integrates the docusaurus-plugin-cookie-consent package."
    >
      <main className="container margin-vert--lg">
        <Heading as="h1" className="text--center">
          Docusaurus Cookie Consent Plugin Demo
        </Heading>
        <p className="hero__subtitle text--center">
          Explore how the plugin renders a consent banner, stores preferences, and exposes a React
          API for your components.
        </p>

        <section className="margin-top--xl">
          <Heading as="h2">Why this example exists</Heading>
          <p>
            This repository builds and tests the plugin in isolation. The demo site lives under{' '}
            <code>examples/sample-site</code> so you can run a real Docusaurus project locally,
            experiment with different configuration options, and see how the consent toast behaves.
          </p>
          <p>
            Start the dev server with <code>npm install</code> followed by <code>npm start</code>{' '}
            inside this folder. The site will open on{' '}
            <code>http://localhost:3000</code> with the plugin already wired up.
          </p>
        </section>

        <CookiePreferenceDemo />
      </main>
    </Layout>
  )
}

