<!-- <template>
  <v-dialog  :model-value="modelValue" max-width="350">
    <v-card rounded="lg">
      <v-toolbar color="primary">
        <v-toolbar-title>Update User Status</v-toolbar-title>
        <v-icon @click="close">mdi-close</v-icon>
      </v-toolbar>

      <v-card-text>
        <v-radio-group v-model="localStatus">
          <v-radio label="Active" value="ACTIVE" />
          <v-radio label="Inactive" value="INACTIVE" />
        </v-radio-group>
      </v-card-text>

      <v-card-actions class="pa-3">
        <v-spacer />
        <v-btn variant="outlined" color="redBtnColor" @click="$emit('update:modelValue', false)">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="flat" @click="submit">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { changeUserStatus } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export default {
  props: {
    modelValue: Boolean,       // dialog open/close
    user: Object               // { user_id, user_status }
  },

  emits: ["update:modelValue", "success", "error"],

  data() {
    return {
      localStatus: this.user?.user_status,
    };
  },

  watch: {
    user: {
      immediate: true,
      handler(val) {
        this.localStatus = val?.user_status==='ACTIVE'?"INACTIVE":"ACTIVE";
      },
    },
  },

  methods: {
    async submit() {
      if (!this.user) return;
      try {
        await client.graphql({
          query: changeUserStatus,
          variables: {
            input: {
              user_id: this.user.user_id,
              user_status: this.localStatus,
            },
          },
        });

        this.$emit("success");
        this.$emit("update:modelValue", false);
      } catch (e) {
        this.$emit("error", e);
      }
    },
    close() {
    this.$emit("update:modelValue", false);
    }
  },
};
</script> -->

<template>
  <v-dialog :model-value="modelValue" max-width="400">
    <v-card rounded="lg">
      <v-toolbar color="primary">
        <v-toolbar-title>Confirm Status Change</v-toolbar-title>
        <v-icon @click="close">mdi-close</v-icon>
      </v-toolbar>

      <v-card-text class="pa-5">
        <p class="text-h6 mb-2">
          Are you sure you want to
          <strong>{{
            newStatus === "ACTIVE" ? "activate" : "deactivate"
          }}</strong>
          this user?
        </p>
        <p class="text-body-2 text-grey">
          Current status:
          <v-chip
            :color="user?.user_status === 'ACTIVE' ? 'success' : 'error'"
            size="small"
          >
            {{ user?.user_status }}
          </v-chip>
        </p>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn class="fontVariant1" variant="outlined" color="redBtnColor" @click="close">
          Cancel
        </v-btn>
        <v-btn
        class="fontVariant1"
          color="primary"
          variant="flat"
          @click="UserStatusUpdateDialogsubmit"
          :loading="loading"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { changeUserStatus } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export default {
  props: {
    modelValue: Boolean,
    user: Object, // { user_id, user_status }
  },

  emits: ["update:modelValue", "success", "error"],

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    newStatus() {
      return this.user?.user_status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    },
  },

  methods: {
    async UserStatusUpdateDialogsubmit() {
      if (!this.user) return;

      this.loading = true;
      try {
        await client.graphql({
          query: changeUserStatus,
          variables: {
            input: {
              user_id: this.user.user_id,
              user_status: this.newStatus,
            },
          },
        });

        this.$emit("success");
        this.$emit("update:modelValue", false);
      } catch (e) {
        this.$emit("error", e);
      } finally {
        this.loading = false;
      }
    },

    close() {
      this.$emit("update:modelValue", false);
    },
  },
};
</script>
