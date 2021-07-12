<template>
  <div>
    <leader v-if="$route.name == 'leader'" />
    <miduser v-else-if="$route.name == 'miduser'" />
    <basicuser v-else-if="$route.name == 'basicuser'" />
  </div>
</template>

<script>
import { leader, miduser, basicuser } from './components'
export default {
  components: {
    leader,
    miduser,
    basicuser
  },
  data() {
    return {}
  },
  computed: {},
  created() {}
}
</script>

<style lang="" scoped></style>
