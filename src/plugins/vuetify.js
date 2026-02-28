// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { VFileUploadItem } from 'vuetify/labs/VFileUpload'
// Vuetify
import { createVuetify } from 'vuetify'
const myCustomTheme = {
  dark: false,
  colors: {
    primary: "#03376b",
    profileBackground:'#72e128',
    redBtnColor:'#f44366' 
  },
};

const darkTheme = {
  dark: true,
  colors: {
    primary: "#90caf9",
    profileBackground: "#72e128",
    redBtnColor: "#ef5350",
  },
}
export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
   components:{
    VFileUpload,
    VFileUploadItem
  },
   theme: {
    defaultTheme: 'light',
    themes: {
      light: myCustomTheme,
      dark: darkTheme,
  },  
},
defaults: {
    VBtn: {
      style: 'text-transform: none;',
      rounded:'lg'
    },
    VTextField:{
      density:'comfortable'
    }
  },
 
})
