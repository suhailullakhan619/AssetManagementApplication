<!-- <template>
  <v-theme-provider theme="light">
    <v-container fluid class="login-bg fill-height">
      <SnackbarComp :snackbarComponent="snackbarComponent"></SnackbarComp>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card elevation="14" rounded="xl" class="pa-7 login-card">
            <div class="text-center mb-6">
              <v-avatar size="60" class="mb-3" color="primary" variant="tonal">
                <v-img src="@/assets/assetLogo.svg" />
              </v-avatar>

              <h2 class="font-weight-bold">Welcome Back</h2>
              <p class="text-grey">Login to your account</p>
            </div>

            <v-form ref="formRef" @submit.prevent="validateFormMethod">
              <v-text-field label="Email address*" v-model="email" prepend-inner-icon="mdi-email-outline"
                variant="outlined" density="comfortable" :rules="[
                  (v) => !!v || 'Email ID is required',
                  (v) => !/\s/.test(v) || 'Email must not contain spaces',
                  (v) =>
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      v,
                    ) || 'Enter a valid email address',
                ]" color="primary" class="mb-4" />

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
</template> -->

<!-- <script>
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
      showPassword: false,
      loading: false,
      email: "",
      password: "",
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
</style> -->

<template>
  <v-theme-provider theme="light">
    <v-container fluid class="login-bg fill-height">
      <SnackbarComp :snackbarComponent="snackbarComponent" />

      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">

          <v-card elevation="14" rounded="xl" class="pa-7 login-card">

            <!-- HEADER -->
            <div class="text-center mb-6">
              <v-avatar size="60" class="mb-3" color="primary" variant="tonal">
                <v-img src="@/assets/assetLogo.svg" />
              </v-avatar>

              <h2 class="font-weight-bold">
                {{ step === 'LOGIN' ? 'Welcome Back' : 'Create New Password' }}
              </h2>

              <p class="text-grey">
                {{
                  step === 'LOGIN'
                    ? 'Login with your password'
                    : 'Set your new secure password'
                }}
              </p>
            </div>

            <!-- FORM -->
            <v-form ref="formRef" @submit.prevent="handleSubmit">

              <!-- STEP 1 -->
              <template v-if="step === 'LOGIN'">

                <v-text-field
                  label="Email address*"
                  v-model="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="[v => !!v || 'Email required']"
                />

                <v-text-field
                  label="Password*"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'Password required']"
                />

              </template>

              <!-- STEP 2 -->
              <template v-else>

                <v-text-field
  label="Full Name*"
  v-model="fullName"
  prepend-inner-icon="mdi-account"
  variant="outlined"
  class="mb-4"
  :rules="[v => !!v || 'Name required']"
/>

                <v-text-field
                  label="New Password*"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="newPassword"
                  prepend-inner-icon="mdi-lock-reset"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  :rules="passwordRules"
                />

                <v-text-field
                  label="Confirm Password*"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  prepend-inner-icon="mdi-lock-check"
                  variant="outlined"
                  density="comfortable"
                  :rules="[
                    v => !!v || 'Confirm password required',
                    v => v === newPassword || 'Passwords do not match'
                  ]"
                />

              </template>

              <v-btn
                color="primary"
                size="large"
                block
                class="mt-6"
                :loading="loading"
                type="submit"
              >
                {{ step === 'LOGIN' ? 'Sign In' : 'Set Password & Continue' }}
              </v-btn>

            </v-form>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-theme-provider>
</template>
<script>
import { signIn, confirmSignIn,signOut } from "aws-amplify/auth"
import SnackbarComp from "@/components/Extras/SnackbarComp.vue"

export default {
  components: { SnackbarComp },

  data() {
    return {
      step: "LOGIN",
      fullName: "",
      email: "owner_m80@gmail.com",
      password: "*Asset1*",
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
      loading: false,
      user: null,
      snackbarComponent: {}
    }
  },

  computed: {
    passwordRules() {
      return [
        v => !!v || 'Password required',
        v => v.length >= 8 || 'Minimum 8 characters',
        v => /[A-Z]/.test(v) || 'One uppercase required',
        v => /[a-z]/.test(v) || 'One lowercase required',
        v => /[0-9]/.test(v) || 'One number required',
        v => /[@$!%*?&]/.test(v) || 'One special character required'
      ]
    }
  },

  methods: {

    async handleSubmit() {
      const { valid } = await this.$refs.formRef.validate()
      if (!valid) return

      if (this.step === "LOGIN") {
        await this.loginUser()
      } else {
        await this.completeNewPassword()
      }
    },

   async loginUser() {
  this.loading = true

  try {

    // 🔥 Always clear old session first
    await signOut({ global: false })

  } catch (e) {
    // ignore error if no user signed in
  }

  try {

    const result = await signIn({
      username: this.email,
      password: this.password
    })

    this.user = result

    // CASE 1: NEW PASSWORD REQUIRED
    if (
      result.nextStep?.signInStep ===
      "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    ) {
      this.step = "NEW_PASSWORD"
      this.password = ""
      return
    }

    // CASE 2: NORMAL LOGIN
    if (result.isSignedIn) {

      this.snackbarComponent = {
        snackBarModel: true,
        color: "green",
        message: "Login successful..!!"
      }

      setTimeout(() => {
        this.redirectToLanding()
      }, 700)
    }

  } catch (err) {
    this.showError(err?.message)
  } finally {
    this.loading = false
  }
},
    async completeNewPassword() {
      this.loading = true
      try {

        await confirmSignIn({
          challengeResponse: this.newPassword,
          options: {
    userAttributes: {
      name: this.fullName   // 👈 REQUIRED
    }
  }
        })

        this.showSuccess("Password updated successfully")
        setTimeout(() => {
          this.redirectToLanding()
        }, 600)

      } catch (err) {
        this.showError(err?.message)
      } finally {
        this.loading = false
      }
    },

    redirectToLanding() {
      this.$router.push("/LandingPage")
    },

    showError(message) {
      this.snackbarComponent = {
        snackBarModel: true,
        color: "error",
        message: message || "Something went wrong"
      }
    },

    showSuccess(message) {
      this.snackbarComponent = {
        snackBarModel: true,
        color: "green",
        message
      }
    }
  }
}
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