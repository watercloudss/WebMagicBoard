<template>
  <i-frame :src="url" />
</template>
<script>
import iFrame from '@/components/iFrame/index'
export default {
  name: 'Druid',
  components: { iFrame },
  data() {
    return {
      url: 'http://127.0.0.1:9000/druid/login.html'
    }
  }
}
</script>
