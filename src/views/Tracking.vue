<template>
  <div class="page tracking" v-if="order.data">
    <div class="info-block">
      <div class="title-block">
        <truck />
        <h2 class="tracking-title">Информация о доставке</h2>
      </div>
      <ul class="info-list">
        <li class="info-item">
          Адрес:
          <b>{{ address }}</b>
        </li>
        <li class="info-item">
          Способ доставки:
          <b>{{ deliveryMethod }}</b>
        </li>
        <li class="info-item" v-if="track">
          Номер отслеживания:
          <b>{{ track }}</b>
        </li>
      </ul>
    </div>
    <div class="info-block">
      <div class="title-block">
        <shopping />
        <h2 class="tracking-title">Информация о заказе</h2>
      </div>
      <ul class="info-list">
        <li class="info-item">
          Статус:
          <status :value="status" />
        </li>
      </ul>
    </div>
    <div class="order-items">
      <div class="order-item" v-for="(item, index) in orderItems" :key="index">
        <h3 class="order-title">{{ item.catalogItem.name }}</h3>
        <ul class="info-list">
          <li class="info-item">
            Описание:
            <b>{{ item.catalogItem.description }}</b>
          </li>
          <li class="info-item">
            Размер:
            <b>RU 48</b>
          </li>
          <li class="info-item">
            Цвет:
            <b>Асфальт</b>
          </li>
          <li class="info-item">
            Цена:
            <b>{{ item.catalogItem.price }}₽</b>
          </li>
          <li class="info-item">
            Количество:
            <b>{{ item.amount }} шт.</b>
          </li>
          <li class="info-item">
            Стоимость:
            <b>{{ item.catalogItem.price * item.amount }}₽</b>
          </li>
        </ul>
        <div class="images">
          <div class="image-wrap" v-for="(image, i) in item.catalogItem.photos" :key="i">
            <img :src="image" alt="image">
          </div>
        </div>
      </div>
    </div>
    <div class="pay-info">
      <div class="info-wrap">
        <div class="pay-info-item">
          <span>Товары</span>
          <span>{{ total }}₽</span>
        </div>
        <div class="pay-info-item">
          <span>Доставка</span>
          <span>0₽</span>
        </div>
      </div>
      <div class="pay-total">
        <span>Общая стоимость</span>
        <span class="price">{{ total }}₽</span>
      </div>
    </div>
    <button class="pay" @click="pay">Оплатить заказ — {{ forPayment }}₽</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, reactive } from 'vue'
import Truck from '@/icons/Truck.vue'
import Shopping from '@/icons/Shopping.vue'
import Status from '@/components/Status.vue'
import { OrderService } from '@/services/order.service'
import { useRoute } from 'vue-router'
import { DeliveryMethod, OrderTypes } from '@/types/order.types'

export default defineComponent({
  components: { Status, Shopping, Truck },
  setup() {
    const orderService = new OrderService()
    const route = useRoute()

    const order = reactive<{ data: OrderTypes | null }>({
      data: null
    })

    const id = computed(() => {
      if (typeof route.params.id === 'string') return route.params.id
      return ''
    })

    const address = computed(() => {
      if (order.data) {
        return `${
          order.data.address.country
        }, ${
          order.data.address.city
        }, ${
          order.data.address.address1
        }${
          order.data.address.address2
            ? `, ${order.data.address.address2}`
            : ''
        }`
      }
      return ''
    })

    const deliveryMethod = computed(() => {
      if (order.data) {
        switch (order.data.deliveryMethod) {
          case DeliveryMethod.RUSSIAN_POST:
            return 'Почта России'
          default:
            return 'Почта России'
        }
      }
      return 'Почта России'
    })

    const track = computed(() => {
      if (order.data) {
        return order.data.trackCode
      }
      return ''
    })

    const status = computed(() => {
      if (order.data) {
        return order.data.status
      }
      return 'created'
    })

    const total = computed(() => {
      if (order.data) {
        return +order.data.total
      }
      return '0₽'
    })

    const forPayment = computed(() => {
      if (order.data) {
        return +order.data.total - +order.data.paid
      }
      return '0₽'
    })

    const orderItems = computed(() => {
      if (order.data) {
        return order.data.items
      }
      return null
    })

    onBeforeMount(async () => {
      order.data = await orderService.getOrder(id.value)
    })

    async function pay() {
      const info = await orderService.payByToken(id.value)
      window.open(info.confirmation_url)
    }

    return {
      order,
      address,
      deliveryMethod,
      track,
      status,
      total,
      forPayment,
      orderItems,
      pay
    }
  }
})
</script>

<style lang="scss" scoped>
.tracking {
  width: 100%;
  .info-block {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
    .title-block {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .tracking-title {
        margin-left: 8px;
        font-size: 16px;
      }
    }
  }
  .info-list {
    .info-item {
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 7px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .order-items {
    margin-bottom: 20px;
    .order-item {
      background-color: #F2F2F2;
      border: 1px solid #E5E5E5;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
      .order-title {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 600;
      }
      .images {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        grid-gap: 15px;
        .image-wrap {
          position: relative;
          &::before {
            content: '';
            padding-top: 100%;
            display: block;
            grid-area: 1 / 1 / 2 / 2;
          }
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            grid-area: 1 / 1 / 2 / 2;
          }
        }
      }
    }
  }
  .pay-info {
    .info-wrap {
      .pay-info-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 7px;
        &:last-child {
          margin-bottom: 0;
        }
        span {
          font-size: 14px;
          font-weight: 600;
        }
      }
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px solid #E5E5E5;
    }
    .pay-total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        font-size: 16px;
        font-weight: 700;
        &.price {
          color: #de4343;
        }
      }
    }
  }
  .pay {
    width: 100%;
    margin-top: 30px;
    height: 50px;
    background-color: #de4343;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
}
</style>