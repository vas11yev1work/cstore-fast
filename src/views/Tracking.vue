<template>
  <div class="page tracking" v-if="order.data">
    <div class="info-block">
      <div class="title-block">
        <img src="../assets/delivery.svg" alt="delivery">
        <h2 class="tracking-title">Информация о доставке</h2>
      </div>
      <ul class="info-list">
        <li class="info-item" v-if="address">
          Адрес:
          <b>{{ address }}</b>
        </li>
        <li class="info-item" v-if="delivery">
          Способ доставки:
          <b>{{ delivery }}</b>
        </li>
        <li class="info-item" v-if="track">
          Номер отслеживания:
          <b>{{ track }}</b>
        </li>
      </ul>
    </div>
    <div class="info-block">
      <div class="title-block">
        <img src="../assets/shopping-bag.svg" alt="delivery">
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
          <li class="info-item" v-if="item.catalogItem.description">
            Описание:
            <b>{{ item.catalogItem.description }}</b>
          </li>
          <li class="info-item" v-if="item.sizeId">
            Размер:
            <b>{{ item.sizeId }}</b>
          </li>
          <li class="info-item" v-if="item.catalogItem.itemColors.length">
            Цвет:
            <b>{{ item.catalogItem.itemColors.map(x => x.name).join(', ').toLowerCase() }}</b>
          </li>
          <li class="info-item" v-if="item.catalogItem.price">
            Цена:
            <b>{{ item.catalogItem.price }}₽</b>
          </li>
          <li class="info-item" v-if="item.amount">
            Количество:
            <b>{{ item.amount }} шт.</b>
          </li>
          <li class="info-item" v-if="item.amount && item.catalogItem.price">
            Стоимость:
            <b>{{ item.catalogItem.price * item.amount }}₽</b>
          </li>
        </ul>
        <div class="images" v-if="item.catalogItem.photos.length">
          <div class="image-wrap" v-for="(image, i) in item.catalogItem.photos" :key="i">
            <img :src="image" alt="image">
          </div>
        </div>
      </div>
    </div>
    <div class="pay-info">
      <div class="info-wrap">
        <div class="pay-info-item" v-if="total">
          <span>Товары</span>
          <span>{{ itemsPrice }}₽</span>
        </div>
        <div class="pay-info-item" v-if="deliveryPrice">
          <span>Доставка</span>
          <span>{{ deliveryPrice }}₽</span>
        </div>
      </div>
      <div class="pay-total">
        <span>Общая стоимость</span>
        <span class="price" :class="{ paid: forPayment === 0 }">{{ total }}₽</span>
      </div>
    </div>
    <button class="pay" @click="pay" :class="{ paid: forPayment === 0 }" :disabled="loading">
      {{ forPayment !== 0 ? `Оплатить заказ — ${forPayment}₽` : 'Заказ оплачен' }}
    </button>
  </div>
  <div class="not-found page" v-else-if="notFound">
    <p class="description">К сожалению заказ не найден 😥</p>
    <p class="description">Ты можешь написать нам, чтобы оформить заказ!</p>
    <div class="button-wrap">
      <a href="https://instagram.com/severside.store" target="_blank" class="inst">Перейти в инстаграм</a>
    </div>
  </div>
  <div class="loading page" v-else-if="loading">
    <img src="../assets/loader.svg" alt="loader">
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, reactive, ref } from 'vue'
import Status from '@/components/Status.vue'
import { ApiService } from '@/services/api.service'
import { useRoute } from 'vue-router'
import { DeliveryMethod, DeliveryOrderItemAttributes, OrderItemAttributes, OrderTypes } from '@/types/api.types'

export default defineComponent({
  components: { Status },
  setup() {
    const orderService = new ApiService()
    const route = useRoute()
    const notFound = ref(false)
    const loading = ref(false)

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
      return 0
    })

    const forPayment = computed(() => {
      if (order.data) {
        return +order.data.total - +order.data.paid
      }
      return 0
    })

    const orderItems = computed(() => {
      if (order.data) {
        return order.data.items.filter(x => x.itemType === 'CatalogOrderItem') as OrderItemAttributes[]
      }
      return []
    })

    const deliveryData = computed(() => {
      if (order.data) {
        return order.data.items.find(x => x.itemType === 'DeliveryOrderItem') as DeliveryOrderItemAttributes
      }
      return null
    })

    const deliveryProvider = computed(() => {
      if (order.data) {
        switch (deliveryData.value?.deliveryProvider) {
          case 'ozon':
            return 'Озон'
          default:
            return 'Озон'
        }
      }
      return ''
    })
    
    const delivery = computed(() => {
      if (order.data) {
        return `${deliveryProvider.value}${deliveryMethod.value ? `, ${deliveryMethod.value}` : ''}`
      }
      return ''
    })

    const deliveryMethod = computed(() => {
      if (order.data) {
        switch (deliveryData.value?.deliveryMethod) {
          case DeliveryMethod.Courier:
            return 'курьер'
          case DeliveryMethod.Office:
            return 'постамат'
          case DeliveryMethod.PickPoint:
            return 'пункт выдачи'
        }
      }
      return ''
    })

    const deliveryPrice = computed(() => {
      if (order.data) {
        return +(deliveryData.value?.price || 0) || 0
      }
      return 0
    })

    const itemsPrice = computed(() => {
      if (order.data) {
        return orderItems.value.reduce((acc, v) => acc + +v.catalogItem.price, 0)
      }
      return 0
    })

    onBeforeMount(async () => {
      try {
        loading.value = true
        order.data = await orderService.getOrder(id.value)
      } catch {
        notFound.value = true
      } finally {
        loading.value = false
      }
    })

    async function pay() {
      try {
        if (forPayment.value !== 0) {
          loading.value = true
          const info = await orderService.payByToken(id.value)
          if (!info.confirmation_url) return
          const a = document.createElement('a')
          a.setAttribute('href', info.confirmation_url)
          a.setAttribute('target', '_blank')
          a.click()
        }
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }

    return {
      deliveryPrice,
      deliveryData,
      delivery,
      order,
      address,
      deliveryMethod,
      track,
      status,
      total,
      forPayment,
      orderItems,
      notFound,
      loading,
      itemsPrice,
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
          &.paid {
            color: #64C999;
          }
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
    &:disabled {
      opacity: 0.8;
    }
    &.paid {
      background-color: #64C999;
    }
  }
}
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  .button-wrap {
    .inst {
      display: block;
      margin-top: 10px;
      padding: 10px 16px;
      background-color: #de4343;
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      border-radius: 5px;
    }
  }
}
</style>