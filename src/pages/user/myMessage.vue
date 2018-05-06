<template>
  <div>{{msg}}</div>
</template>

<script>
import './myMessage.less'

export default {
  name: 'myMessage',
  data: function () {
    return {
      msg: 'myMessage'
    }
  }
}
</script>
