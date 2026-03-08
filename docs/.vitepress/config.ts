import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'spusu-cli',
  description: 'Unofficial CLI for spusu.at - Austrian mobile provider',

  base: '/spusu-cli/',

  head: [
    ['meta', { name: 'theme-color', content: '#005F59' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:site_name', content: 'spusu-cli' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Commands', link: '/commands/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
          ]
        }
      ],
      '/commands/': [
        {
          text: 'Commands',
          items: [
            { text: 'Overview', link: '/commands/' },
            { text: 'login', link: '/commands/login' },
            { text: 'logout', link: '/commands/logout' },
            { text: 'whoami', link: '/commands/whoami' },
            { text: 'status', link: '/commands/status' },
            { text: 'tariffs', link: '/commands/tariffs' },
            { text: 'invoices', link: '/commands/invoices' },
            { text: 'config', link: '/commands/config' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tomLadder/spusu-cli' }
    ],

    footer: {
      message: 'Released under the MIT License. Not affiliated with spusu.',
      copyright: 'Made with ❤️ in Austria'
    },

    search: {
      provider: 'local'
    }
  }
})
