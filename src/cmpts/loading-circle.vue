<template>
	<view class="loading" :style="'transform: scale(' + scale + ');opacity: ' + opacity + ';'">
	</view>
</template>

<script>
const pageOption = {
		props: {
			scale: {
				type: Number,
				default: 1
			},
			opacity: {
				type: Number,
				default: 1
			}
		}
	}
	export default pageOption;
</script>

<style scoped lang="scss">
	
.loading {
  font-size: 20rpx;
  // margin: 30% auto;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 4rpx solid #666;
  border-color: transparent;
  border-top-color: #666;
  border-right-color: #666;
  border-left-color: #efefef;
  border-bottom-color: #efefef;
  position: relative;
  animation: load3 1s infinite linear;
}
@keyframes load3 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
