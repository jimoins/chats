export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    host: '0.0.0.0',
    port: 3000, // 你的开发服务器端口
  },
  app: {
    head: {
      title: '',
      meta: [
        {
          charset: "utf-8"
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
        { src: "font/iconfont.js" },

      ]
    }
  },
  runtimeConfig: {
    public: {
      apikey: process.env.PUBLIC_API_KEY,
      baseURL: process.env.PUBLIC_API_URL, 
      knowledge: process.env.PUBLIC_API_KNOWLEDGE
    }
  }
})
