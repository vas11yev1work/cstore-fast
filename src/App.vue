<template>
  <div class="container" :style="{ maxWidth: `${container}px` }">
    <div class="content">
      <img src="./assets/logo.svg" class="logo" alt="logo">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()

    const container = computed(() => {
      return route.meta['container'] || 420
    })

    return { container }
  }
}
</script>

<style>
.container {
  margin: 40px auto;
  width: 100%;
}

.logo {
  width: 300px;
  margin-bottom: 40px;
}

@media (max-width: 350px) {
  .logo {
    width: 240px;
  }
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>