<script setup>
import QRCode from 'qrcode'
import { ref, onUnmounted, nextTick, onMounted } from 'vue'
import html2canvas from 'html2canvas'
import '../assets/poster.css'

const photoUrl = ref('')
const hasPhoto = ref(false)
let objectUrl = ''

const onPhotoChange = (e) => {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = URL.createObjectURL(f)
  photoUrl.value = objectUrl
  hasPhoto.value = true
}

const headUrl = ref('')
const hasHead = ref(false)
let headObjectUrl = ''

const onHeadChange = (e) => {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  if (headObjectUrl) URL.revokeObjectURL(headObjectUrl)
  headObjectUrl = URL.createObjectURL(f)
  headUrl.value = headObjectUrl
  hasHead.value = true
}

const bgRef = ref(null)
const generating = ref(false)
const onGenerate = async () => {
  if (!bgRef.value || generating.value) return
  const n = nameText()
  if (!n) { alert('请输入昵称'); return }
  generating.value = true
  try {
    await genQrForName()
    if (!qrDataUrl.value) return
    try {
      const n = nameText()
      await fetch('http://192.168.10.111:8080/api/stat/register?name=' + encodeURIComponent(n), { method: 'POST' })
    } catch {}
    hasQr.value = !!qrDataUrl.value
    await nextTick()
    const imgEl = document.querySelector('.ewm .qrcode-img')
    if (imgEl && !imgEl.complete) {
      await new Promise(r => { imgEl.onload = r })
    }
    const desiredWidth = 1080
    const scale = Math.max(2, desiredWidth / bgRef.value.offsetWidth)
    const canvas = await html2canvas(bgRef.value, { scale, useCORS: true })
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'poster.png'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } finally {
    hasQr.value = false
    generating.value = false
  }
}

const qrDataUrl = ref('')
const hasQr = ref(false)
const headRef = ref(null)
const textRef = ref(null)

const updateHeadEmpty = () => {
  const t = (headRef.value?.innerText || '').trim()
  if (!headRef.value) return
  if (t) headRef.value.removeAttribute('data-empty')
  else headRef.value.setAttribute('data-empty', 'true')
}

const nameText = () => (headRef.value?.innerText || '').trim()
const genQrForName = async () => {
  const n = nameText()
  if (!n) { qrDataUrl.value = ''; return }
  const target = 'http://192.168.10.111:8080/r/' + encodeURIComponent(n)
  qrDataUrl.value = await QRCode.toDataURL(target, { width: 640, margin: 2 })
}

onUnmounted(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  if (headObjectUrl) URL.revokeObjectURL(headObjectUrl)
  headRef.value?.removeEventListener('input', updateHeadEmpty)
})

const initTextArea = () => {
  const el = textRef.value
  if (!el) return
  let prevHTML = el.innerHTML
  const placeCaretAtEnd = (node) => {
    const range = document.createRange()
    range.selectNodeContents(node)
    range.collapse(false)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }
  const overflowed = () => el.scrollHeight > el.clientHeight + 1
  el.addEventListener('beforeinput', () => { prevHTML = el.innerHTML })
  el.addEventListener('input', () => {
    if (overflowed()) {
      el.innerHTML = prevHTML
      placeCaretAtEnd(el)
    }
  })
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.execCommand('insertLineBreak')
    }
  })
  el.addEventListener('paste', (e) => {
    e.preventDefault()
    const text = (e.clipboardData || window.clipboardData).getData('text')
    document.execCommand('insertText', false, text)
  })
}

onMounted(() => {
  initTextArea()
  updateHeadEmpty()
  headRef.value?.addEventListener('input', updateHeadEmpty)
})
</script>

<template>
  <div class="box">
    <div class="bg" ref="bgRef">
      <div class="photo" :class="{'has-image': hasPhoto}" :style="{ backgroundImage: hasPhoto ? `url(${photoUrl})` : '' }">
        <input type="file" accept="image/*" @change="onPhotoChange">
        <label class="photo-label" >选择图片</label>
      </div>

      <div class="text" contenteditable="true" data-placeholder="在此输入文本" ref="textRef"></div>

      <div class="head">
        <div class="head-photo" :class="{'has-image': hasHead}" :style="{ backgroundImage: hasHead ? `url(${headUrl})` : '' }">
          <input type="file" accept="image/*" @change="onHeadChange">
          <label class="photo-label">上传头像</label>
        </div>
        <div class="head-text" contenteditable="true" ref="headRef"></div>
      </div>

      <div class="ewm" :class="{'has-qr': hasQr}">
        <div class="qrcode-card">
           <img v-if="qrDataUrl" :src="qrDataUrl" class="qrcode-img" alt="">
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="generate-btn" @click="onGenerate" :disabled="generating">生成图片</button>
    </div>
  </div>
</template>