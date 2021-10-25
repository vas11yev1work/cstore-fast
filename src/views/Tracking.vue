<template>
  <div class="page tracking">
    <h1 class="title">Информация о заказе</h1>
    <div class="order-data" v-if="orderData.data">
      <ul class="order-info">
        <li class="info-item">
          <b>Адрес: </b>
          <span>{{ address }}</span>
        </li>
        <li class="info-item">
          <b>Способ доставки: </b>
          <span>{{ deliveryMethod }}</span>
        </li>
        <li class="info-item">
          <b>Статус: </b>
          <span class="status" :class="status.color">{{ status.status }}</span>
        </li>
      </ul>
      <div class="order-items">
        <div class="item" v-for="(item, i) in orderData.data.items" :key="i">
          <ul class="order-info">
            <li class="info-item">
              <b>Название: </b>
              <span>{{ item.catalogItem.name }}</span>
            </li>
            <li class="info-item">
              <b>Цена: </b>
              <span>{{ item.catalogItem.price }}₽</span>
            </li>
            <li class="info-item">
              <b>Количество: </b>
              <span>{{ item.amount || 0 }} шт.</span>
            </li>
            <li class="info-item">
              <b>Стоимость: </b>
              <span>{{ item.amount * +item.catalogItem.price || 0 }}₽</span>
            </li>
          </ul>
          <div class="pictures">
            <img v-for="(photo, index) in item.catalogItem.photos" :src="photo" :alt="photo" :key="index" />
          </div>
        </div>
      </div>
      <ul class="order-info">
        <li class="info-item">
          <b>Итого: </b>
          <span>{{ orderData.data.total || '0' }}₽</span>
        </li>
      </ul>
    </div>
    <button class="pay">Оплатить заказ</button>
  </div>
</template>

<script>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, reactive, ref } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const orderNotFound = ref(false)
    const orderData = reactive({
      data: null
    })

    async function getOrder() {
      try {
        const { data } = await axios.get(`https://api.4be.site/order/fast-view/${route.params.id}`)
        console.log(data)
        if (data === '') {
          orderNotFound.value = true
          return
        }
        orderData.data = { ...data }
      } catch (e) {
        console.log(e)
      }
    }

    const address = computed(() => {
      if (orderData.data.address && orderData.data.address.address1) {
        return `${
          orderData.data.country || 'Россия'
        }, ${
          orderData.data.city || 'Санкт-Петербург'
        },  ${
          orderData.data.address.address1}${orderData.data.address.address2
          ? `, ${orderData.data.address.address2}`
          : ''
        }`
      }
      return 'отсутствует'
    })

    const deliveryMethod = computed(() => {
      if (orderData.data.deliveryMethod === 'RussianPost') {
        return 'Почта России'
      }
      return 'Почта России'
    })

    const status = computed(() => {
      if (orderData.data.status === 'created') {
        return {
          status: 'Создан',
          color: 'green'
        }
      }
      return {
        status: 'Создан',
        color: 'green'
      }
    })

    onBeforeMount(async () => {
      await getOrder()
    })

    return { orderData, address, deliveryMethod, status }
  }
}
</script>

<style lang="scss" scoped>
.tracking {
  width: 100%;
  .order-data {
    width: 100%;
    .order-info {
      font-size: 14px;
      .info-item {
        line-height: 1.5;
        margin-bottom: 7px;
        &:last-child {
          margin-bottom: 0;
        }
        .status {
          &.green {
            background-color: #34a834;
            color: #ffffff;
            font-weight: 500;
            text-transform: uppercase;
            border-radius: 2px;
            padding: 2px 5px;
          }
        }
      }
    }
    .order-items {
      margin: 15px 0;
      .item {
        background-color: #f6f6f6;
        padding: 10px 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        .pictures {
          margin-top: 10px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-gap: 15px;
          img {
            height: 100%;
            width: 100%;
            aspect-ratio: 1;
          }
        }
      }
    }
  }
}
.pay {
  height: 40px;
  width: 100%;
  background-color: #de4343;
  color: #ffffff;
  border-radius: 3px;
  border: none;
  font-size: 14px;
  margin-top: 15px;
}
</style>