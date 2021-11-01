<template>
  <div class="page home">
    <h1 class="title">Отслеживание</h1>
    <p class="description">Введите трек-номер для отслеживания своего заказа 📦</p>
    <form @submit.prevent="$router.push({ name: 'Tracking', params: { id: track }})">
      <input v-model="track" type="text" placeholder="Введите трек-номер">
      <button type="submit">
        <img src="../assets/truck.svg" alt="truck">
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const track = ref('')

    return { track }
  }
})
</script>

<style lang="scss" scoped>
.home {
  form {
    display: flex;
    margin-top: 20px;
    input {
      margin-right: 10px;
      height: 40px;
      width: 100%;
      border: 1px solid #e5e5e5;
      border-radius: 3px;
      font-size: 16px;
      padding: 0 12px;
      font-weight: 500;
      outline: none;
    }
    button {
      height: 40px;
      min-width: 40px;
      max-width: 40px;
      background-color: #de4343;
      border: none;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>