<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goPoster = () => router.push('/poster')
</script>

<template>
  <div style="padding:24px">
    <h2>功能</h2>
    <button @click="goPoster">海报生成器</button>
  </div>
</template>