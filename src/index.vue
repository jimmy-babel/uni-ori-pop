<template>
  <view class="ori-popup" :class="placement + '-popup'" v-if="showPopup" :style="'--popup-offset:' + offset + 'rpx;'">
    <view class="mask bg-color-mask" :animation="maskAnimate" @click="clickMask(true)"></view>
    <view class="popup" :class="{ 'popup-bg-color': !customBg }" :style="customPopupStyle" :animation="popupAnimate">
      <view v-if="isShowTitle" class="popup-title flex-b-c f-shrink-0">
        <view class="flex1 bold p-20">
          <slot name="title"></slot>
        </view>
      </view>
      <view class="popup-close f-shrink-0" @click="clickMask()" v-if="isShowClose">
        <close />
      </view>
      <view class="popup-cont " :class="[isTabPage ? 'set-tabbar' : ((safeArea && placement != 'center') ? 'safe-area' : '')]">
        <view class="popup-cont-inner">
          <template v-if="customScroll">
            <slot name="content"></slot>
            <slot></slot>
          </template>
          <template v-else>
            <oriScrollView class="popup-scroll" :enhanced="enhanced">
              <slot name="content"></slot>
              <slot></slot>
            </oriScrollView>
          </template>
        </view>
        <view class="content-loading" v-if="loading">
          <loading :scale="0.5" :opacity="0.5"/>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { close, oriScrollView, loading } from './cmpts/index.js';
const pageOption = {
  components: { close, oriScrollView, loading },
  props: {
    'modelValue': Boolean,
    'type': {
      type: String,
      default: ''
    },
    'isTabPage': Boolean,
    'safeArea':{
      type:Boolean,
      default:true
    },
    'backgroundColor': {
      type: String,
      default: ''
    },
    'isMaskClick': {
      type: Boolean,
      default: true
    },
    'maskBackgroundColor': {
      type: String,
      default: 'rgba(0,0,0,0.4)'
    },
    "placement": { // left ,top, bottom, right, center
      type: String,
      default: "center"
    },
    "timing": {
      type: String,
      default: "ease"
    },
    "isShowClose": {
      type: Boolean,
      default: false
    },
    "isShowTitle": {
      type: Boolean,
      default: false
    },
    "loading": Boolean,
    "enhanced": {
      type: Boolean,
      default: true
    },
    "scrollH": Number,
    "customBg": Boolean,
    "customPopupStyle": String,
    "customScroll":  {
      type: Boolean,
      default: true
    },
    'offset': {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      maskAnimation: {},
      popupAnimation: {},
      maskAnimate: {},
      popupAnimate: {},
      showPopup: false,
      duration: 200,
    }
  },
  watch:{
    modelValue:{
      handler(nV){
        if(this.showPopup != nV){
          nV ? this.show() : this.dismiss();
        }
      },
      immediate: true
    }
  },
  methods: {
    initData(){
      this.maskAnimation = uni.createAnimation({
          transformOrigin: "50% 50%",
          duration: this.duration,
          timingFunction: 'ease',
      })
      this.popupAnimation = uni.createAnimation({
          transformOrigin: "50% 50%",
          duration: this.duration,
          timingFunction: 'ease',
      })
      this.initAnimate();
    },
    initAnimate(){
      if(this.maskAnimation.export) {
        this.maskAnimate = this.maskAnimation?.opacity(0)?.step()?.export();
      }
      if(this.popupAnimation.export) {
        this.setPopAnimate(false);
        this.popupAnimate = this.popupAnimation?.export();
      }
    },
    setPopAnimate(isShow){
      let placement = this.placement;
      console.log('setPopAnimate',placement,isShow);
      let value = isShow ? '0' : '110%';
      switch(placement){
        case "left":
          value = (isShow ? '' : '-') + value;
        case "right":
          this.popupAnimation.translateX(value).step();
          break;
        case "top":
          value = (isShow ? '' : '-') + value;
        case "bottom":
          this.popupAnimation.translateY(value).step();
          break;
        case "center":
          this.popupAnimation.opacity(isShow ? 1 : 0).translate('-50%', '-50%').scale(isShow ? 1 : 0.5).step();
          break;
      }
    },
    clickMask(isMask){
      if(!isMask || this.isMaskClick){
        this.dismiss();
        this.close();
      }
    },
    show() {
      this.showPopup = true;
      this.initData();
      this.$emit('update:modelValue', this.showPopup);
      this.$nextTick(()=>{
        this.maskAnimate = this.maskAnimation.opacity(1).step().export();
        setTimeout(() => {
          this.setPopAnimate(true);
          this.popupAnimate = this.popupAnimation.export();
        }, 50);
      })
    },
    dismiss(){
      this.initAnimate();
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.showPopup = false;
          this.$emit('update:modelValue', this.showPopup);
        },this.duration);
      })
    },
    close(e){
      this.$emit('close',e);
    },
    change(e){
      this.$emit('change',e);
    },
  },
  mounted(){
    this.initData();
  }
}
export default pageOption
</script>

<style scoped lang="scss">
.ori-popup{
  width: 100%;
  position: relative;
  .mask{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 9999;
    background-color: rgba(0,0,0,0.4);
    opacity: 0;
  }
  .popup{
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .popup-bg-color{
    background-color: #fff;
  }
  .popup-cont{
    position: relative;
    flex: 1;
    overflow: hidden;
    display: flex;
    .popup-cont-inner{
      flex: 1;
      width: 100%;
    }
    .popup-scroll{
      width: 100%;
      height: 100%;
    }

  }
  .popup-close{
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    z-index: 2;
    background: #fff;
    border-radius: 50%;
    padding: 6rpx;
  }
  .content-loading{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.left-popup{
  .popup{
    max-width: 80%;
    height: 100%;
    top: 0px;
    left: var(--popup-offset);
    bottom: auto;
    right: auto;
    border-top-right-radius: 12rpx;
    border-bottom-right-radius: 12rpx;
  }
}
.right-popup{
  .popup{
    max-width: 80%;
    height: 100%;
    top: 0px;
    right: var(--popup-offset);
    bottom: auto;
    left: auto;
    border-top-left-radius: 12rpx;
    border-bottom-left-radius: 12rpx;
  }
}
.top-popup{
  .popup{
    height: auto;
    max-height: 80vh;
    width: 100%;
    top: var(--popup-offset);
    left: 0px;
    bottom: auto;
    right: auto;
    border-bottom-left-radius: 12rpx;
    border-bottom-right-radius: 12rpx;
  }
}
.bottom-popup{
  .popup{
    height: auto;
    max-height: 80vh;
    width: 100%;
    top: auto;
    left: 0px;
    bottom: var(--popup-offset);
    right: auto;
    border-top-left-radius: 12rpx;
    border-top-right-radius: 12rpx;
  }
}
.center-popup{
  width: 100%;
  .popup-cont-inner{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popup{
    margin-top: var(--popup-offset);
    top: calc(50%);
    left: 50%;
    max-width: 90%;
    width: 100%;
    transform: translate(-50%, -50%);
    bottom: auto;
    right: auto;
    border-radius: 12rpx;
    opacity: 0;
  }
}

</style>