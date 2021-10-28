<template>
  <span class="status" :class="status.color">
    {{ status.value }}
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { OrderStatus } from '@/types/order.types'

export default defineComponent({
  name: 'Status',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const status = computed(() => {
      switch (props.value) {
        case OrderStatus.CREATED:
          return {
            value: 'Создан',
            color: 'green'
          }
        case OrderStatus.WAITING_FOR_PAYMENT:
          return {
            value: 'Ожидает оплаты',
            color: 'red'
          }
        case OrderStatus.PROCESSING:
          return {
            value: 'В работе',
            color: 'blue'
          }
        case OrderStatus.WAITING_FOR_SHIPPING:
          return {
            value: 'Ожидает отправки',
            color: 'yellow'
          }
        case OrderStatus.SHIPPING:
          return {
            value: 'Передан в доставку',
            color: 'yellow'
          }
        case OrderStatus.WAITING_FOR_PICKUP:
          return {
            value: 'Ожидает получения',
            color: 'blue'
          }
        case OrderStatus.FINISHED:
          return {
            value: 'Доставлен',
            color: 'green'
          }
        case OrderStatus.CANCELED:
          return {
            value: 'Отменен',
            color: 'red'
          }
        default:
          return {
            value: 'Создан',
            color: 'green'
          }
      }
    })

    return { status }
  }
})
</script>

<style lang="scss" scoped>
.status {
  line-height: 22px;
  font-weight: 600;
  font-size: 12px;
  background-color: #64C999;
  color: #FFFFFF;
  display: inline-block;
  padding: 0 5px;
  border-radius: 3px;
  text-transform: uppercase;
  &.green {
    background-color: #64C999;
  }
  &.red {
    background-color: #EC5858;
  }
  &.yellow {
    background-color: #F2C759;
  }
  &.blue {
    background-color: #8671F0;
  }
}
</style>