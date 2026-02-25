import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";
import store from "./store";
import { Amplify } from "aws-amplify";
loadFonts();

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.VUE_APP_AWS_USER_POOL_WEB_CLIENT_ID,
      loginWith: {
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.VUE_APP_AWS_APPSYNC_GRAPHQL_ENDPOINT,
      region: process.env.VUE_APP_AWS_APPSYNC_REGION,
      defaultAuthMode: process.env.VUE_APP_AWS_AUTHENTICATION_TYPE,
    },
  },

});
console.log("hello", Amplify.getConfig());
createApp(App)
.use(store)
.use(router)
.use(vuetify)
.mount("#app");