<template>
  <v-theme-provider theme="light">
    <v-container fluid class="login-bg fill-height">
      <SnackbarComp :snackbarComponent="snackbarComponent"></SnackbarComp>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!-- LOGIN CARD -->
          <v-card elevation="14" rounded="xl" class="pa-7 login-card">
            <!-- HEADER -->
            <div class="text-center mb-6">
              <v-avatar size="60" class="mb-3" color="primary" variant="tonal">
                <v-img src="@/assets/assetLogo.svg" />
              </v-avatar>

              <h2 class="font-weight-bold">Welcome Back</h2>
              <p class="text-grey">Login to your account</p>
            </div>

            <!-- FORM -->
            <v-form ref="formRef" @submit.prevent="validateFormMethod">
              <!-- EMAIL -->
              <v-text-field label="Email address*" v-model="email" prepend-inner-icon="mdi-email-outline"
                variant="outlined" density="comfortable" :rules="[
                  (v) => !!v || 'Email ID is required',
                  (v) => !/\s/.test(v) || 'Email must not contain spaces',
                  (v) =>
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      v,
                    ) || 'Enter a valid email address',
                ]" color="primary" class="mb-4" />

              <!-- PASSWORD -->
              <v-text-field label="Password*" :type="showPassword ? 'text' : 'password'" v-model="password"
                prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword" variant="outlined" density="comfortable"
                color="primary" :rules="[
                  (v) => !!v || 'Password is required',
                  (v) =>
                    v.length >= 8 || 'Password must be at least 8 characters',
                  (v) =>
                    /[A-Z]/.test(v) ||
                    'Must contain at least one uppercase letter',
                  (v) =>
                    /[a-z]/.test(v) ||
                    'Must contain at least one lowercase letter',
                  (v) => /[0-9]/.test(v) || 'Must contain at least one number',
                  (v) =>
                    /[@$!%*?&\#]/.test(v) ||
                    'Must contain at least one special character',
                  (v) => !/\s/.test(v) || 'Password must not contain spaces',
                ]" />

              <!-- SUBMIT -->
              <v-btn color="primary" size="large" block class="mt-6" :loading="loading" :disabled="loading"
                type="submit">
                Sign In
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-theme-provider>
</template>

<script>
import { signIn, signOut } from "aws-amplify/auth";
import SnackbarComp from "@/components/Extras/SnackbarComp.vue";
export default {
  props: {
    SnackbarComp: Object,
  },
  components: {
    SnackbarComp,
  },
  data() {
    return {
      //owner_m80@gmail.com *Asset1*
      showPassword: false,
      loading: false,
      email: "owner_m80@gmail.com",
      password: "*Asset1*",
      snackbarComponent: {

      },
    };
  },
  mounted() { },
  methods: {


    async validateFormMethod() {
      this.loading = true;

      const isValid = await this.$refs.formRef.validate();
      if (isValid.valid) {
        await this.signInMethod();
      } else {
        this.snackbarComponent = {
          snackBarModel: true,
          color: "error",
          message: "Fields marked with astercis (*) are mandatory",
        };
      }
    },


    async signInMethod() {
      this.loading = true;
      try {
        const result = await signIn({
          username: this.email,
          password: this.password,
        });
        console.log("result", result);

        if (result) {
          this.activateMethod();
        }
      } catch (error) {


        if (error?.message === "There is already a signed in user.") {
          await this.signOutMethod();
          return;
        }

        this.snackbarComponent = {
          snackBarModel: true,
          color: "error",
          message: error?.message || error,
        };
      } finally {
        this.loading = false;
      }
    },


    activateMethod() {

      

      
        this.snackbarComponent = {
          snackBarModel: true,
          color: "green",
          message: "User Logged In Successfully..!!",
        };
        setTimeout(()=>{
  this.$router.push("/LandingPage")
        },400)
    

    },
    async signOutMethod() {
      try {
        await signOut({
          global: true,
        });
        await this.signInMethod()
      } catch (error) {
        this.snackbarComponent = {
          snackBarModel: true,
          color: "error",
          message: error,
        };
      }
    },
  },
};
</script>

<style scoped>
.login-bg {
  background: url("@/assets/loginBackground.svg") center / cover no-repeat;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}
</style>
