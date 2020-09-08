<template>
  <div class="wrap">
    <el-button @click="logout">退出</el-button>
    <router-view/>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Layout',
  methods: {
    ...mapMutations({
      bindLogout: 'BIND_LOGOUT',
    }),
    logout() {
      console.log(3333);
      this.$confirm('是否退出账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.bindLogout();
        this.$router.push({
          path: '/login',
        });
      }).catch(() => {});
    },
  },
};
</script>
