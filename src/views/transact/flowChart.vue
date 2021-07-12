<template>
  <div class="fc_main">
    <img :src="fcProcess" />
  </div>
</template>

<script>
export default {
  name: 'flowChart',
  props: {},
  data() {
    return {
      needUrl: ''
    }
  },
  methods: {},
  computed: {
    fcProcess: function() {
      return (
        'data:image/png;base64,' +
        btoa(
          new Uint8Array(this.needUrl.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        )
      )
    }
  },
  created() {}
}
</script>

<style scoped>
img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
