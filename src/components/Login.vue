<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">用户名：</label>
        <input v-model="username" id="username" type="text" required />
      </div>
      <div>
        <label for="password">密码：</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <div>
        <label>身份：</label>
        <select v-model="role">
          <option value="admin">管理员</option>
          <option value="user">用户</option>
        </select>
      </div>
      <button type="submit">登录</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      role: 'user',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      try {
        // 调用后端登录接口
        // 登录接口已自动对接数据库
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}&role=${encodeURIComponent(this.role)}`
        });
        if (response.ok) {
          const msg = await response.text();
          alert(msg);
          localStorage.setItem('token', 'demo')
          this.$router.push('/dashboard')
          // 登录成功后可跳转页面
        } else {
          this.error = await response.text();
        }
      } catch (e) {
        this.error = '登录请求失败';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 350px;
  margin: 60px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  background: #fff;
}
form > div {
  margin-bottom: 18px;
}
label {
  display: inline-block;
  width: 70px;
}
input, select {
  width: 200px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 8px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: #e74c3c;
  margin-top: 10px;
}
</style>