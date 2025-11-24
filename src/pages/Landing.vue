<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import '../assets/poster.css'

const route = useRoute()
const name = (route.query.name || '').toString().trim()
const qrSrc = '/img/qrcode_raykeen_.jpg'
const showPreview = ref(false)
</script>

<template>
  <div class="box2">
    <div class="main-card">
      <div class="title">关注公众号即可参与活动</div>
      <div class="tips">
        <div class="tip-item"><span class="tip-num">1</span> 长按下方二维码识别后关注公众号即可</div>
        <div class="tip-item"><span class="tip-num">2</span> 关注后，在公众号中发送关键词</div>
      </div>
      <div class="anniversary">瑞柯恩12周年</div>
      <div class="qrcode-card">
        <div class="qrcode-title">公众号二维码</div>
        <div class="qrcode-img-box">
          <img :src="qrSrc" alt="公众号二维码" class="qrcode-img" @click="showPreview = true">
        </div>
      </div>
      <div class="bottom-text">源于光,传递爱！</div>
    </div>
    <div v-if="showPreview" class="preview-mask" @click="showPreview=false">
      <div class="preview-panel" @click.stop>
        <img :src="qrSrc" class="preview-img" alt="">
        <div class="preview-actions">
          <a :href="qrSrc" download class="generate-btn">保存图片</a>
          <button class="generate-btn" @click="showPreview=false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>