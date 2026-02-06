<template>
  <view class="ori-popup" :class="placement + '-popup'" v-if="showPopup" :style="'--popup-offset:' + offset + 'px;'">
    <view class="mask bg-color-mask" :style="myCustomMaskStyle" :animation="maskAnimate" @click="clickMask(true)"></view>
    <view class="popup" :class="{ 'popup-bg-color': !customBg }" :style="myCustomPopupStyle" :animation="popupAnimate">
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
      myCustomMaskStyle: 'opacity: 0;',
      myCustomPopupStyle: 'opacity: 0;transform: translate(-50%, -50%) scale(0.5);',
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
    initData() {
      this.maskAnimation = uni.createAnimation({
        transformOrigin: "50% 50%",
        duration: this.duration,
        timingFunction: this.timing
      });
      this.popupAnimation = uni.createAnimation({
        transformOrigin: "50% 50%",
        duration: this.duration,
        timingFunction: this.timing
      });
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
    setPopAnimate(isShow) {
      let placement = this.placement;
      // console.log('setPopAnimate', placement, isShow);
      let value = isShow ? '0' : '110%';
       if(!isShow){
          this.myCustomMaskStyle = 'opacity: 0;';
        }else{
          this.myCustomMaskStyle = 'opacity: 1;';
        }
      switch(placement) {
        case "left":
          value = (isShow ? '' : '-') + value;
          if(isShow){
            this.myCustomPopupStyle = `opacity: 1;transform: translateX(${value});`;
          }else{
            this.myCustomPopupStyle = `opacity: 0;transform: translateX(${value});`;
          }
          break;
        case "right":
          value = (isShow ? '' : '-') + value;
          if(isShow){
            this.myCustomPopupStyle = `opacity: 1;transform: translateX(${value});`;
          }else{
            this.myCustomPopupStyle = `opacity: 0;transform: translateX(${value});`;
          }
          break;
        case "top":
          value = (isShow ? '' : '-') + value;
          if(isShow){
            this.myCustomPopupStyle = `opacity: 1;transform: translateY(${value});`;
          }else{
            this.myCustomPopupStyle = `opacity: 0;transform: translateY(${value});`;
          }
          break;
        case "bottom":
          if(isShow){
            this.myCustomPopupStyle = `opacity: 1;transform: translateY(${value});`;
          }else{
            this.myCustomPopupStyle = `opacity: 0;transform: translateY(${value});`;
          }
          break;
        case "center":
          if(!isShow){
            this.myCustomPopupStyle = 'opacity: 0;transform: translate(-50%, -50%) scale(0.5);';
          }else{
            this.myCustomPopupStyle = 'opacity: 1;transform: translate(-50%, -50%) scale(1);';
          }
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
      // this.initData();
      this.$emit('update:modelValue', this.showPopup);
      this.$nextTick(()=>{
        // this.maskAnimate = this.maskAnimation.opacity(1).step().export();
        setTimeout(() => {
          this.setPopAnimate(true);
          // this.popupAnimate = this.popupAnimation.export();
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

<style scoped lang="less">
.testtest{
  color: red;
}
.ori-popup{
  width: 100%;
  position: relative;
  z-index: 9999;
  .mask{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 1;
    background-color: rgba(0,0,0,0.4);
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }
  .popup{
    position: fixed;
    bottom: 0px;
    left: 0px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 100%;
    transition: all 0.2s ease-in-out;
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
    top: 5px;
    right: 5px;
    z-index: 2;
    background: #fff;
    border-radius: 50%;
    padding: 3px;
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
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
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
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
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
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
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
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
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
    border-radius: 6px;
    opacity: 0;
  }
}

</style>