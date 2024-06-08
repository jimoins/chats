
export default defineNuxtConfig({
  devtools: { enabled: true },
  // devServer: {
  //   port: 3000, // 你的开发服务器端口
  // },
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:8000", // 这里是接口地址
        changeOrigin: true,
        prependPath: true,
      },
    },
  },
  app: {
    head: {
      title: '',
      meta: [
        {
          charset: "utf-8"
        },
        {
          "http-equiv": "X-UA-Compatible",
          content: "IE=edge"
        },
        {
          name: "viewport",
          content: "width=device-width,initial-scale=1.0"
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes"
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        }
      ],
      link: [],
      script: [
        { src: "//at.alicdn.com/t/c/font_4434738_nlpk8afwsy.js" }

      ]
    },
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://platform.archivemodel.cn/_api/assistants/query',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
