<template>
	<div class="newWindows">
		<!--<iframe  src="http://192.168.16.62:8001/modeler/createPage?name=activiti16&amp;key=20200616" width="100%" height="100%"></iframe>-->
		<iframe :src="url" width="100%" height="100%"></iframe>
	</div>
</template>

<script>
	import {
		getProcessMap
	} from '@/api/system/process'
	import axios from 'axios'
//=' + this.$route.query.modelId
	export default {
		data() {
			return {
				htmlTemplate: '',
			}
		},
		computed: {
      url:function(){
      	return 'http://192.168.16.17:8001/editor?modelId=123214';
      }
		},
		created() {


		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
	.newWindows {
		width: 100%;
		height: 100%;
	}
</style>
