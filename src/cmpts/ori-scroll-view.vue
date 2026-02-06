<template>
  <scroll-view class="scroll-view" :id="'scrollView' + randomTxt" :type="type" :style="customStyle" :scroll-x="scrollX"
    :enhanced="enhanced" :scroll-y="scrollY" :refresher-threshold="refresherThreshold" refresher-default-style="none"
    :refresher-triggered="triggered" :refresher-two-level-pinned="false"
    :refresher-two-level-threshold="refresherTwoLevelThreshold" :refresher-two-level-triggered="twoLevelTriggered"
    :refresher-enabled="refresherEnabled" :refresher-two-level-enabled="refresherTwoLevelEnabled"
    :refresher-two-level-scroll-enabled="true" @refresherpulling="onPulling" @refresherrefresh="onRefresh"
    @refresherrestore="onRestore" @refresherabort="onAbort" @refresherstatuschange="onStatusChange"
    @scrolltolower="scrolltolower">
    <view slot="refresher" class="refresher-area">
      <view class="exp-room" v-if="refresherTwoLevelEnabled">
        <view class="expand">
          <view v-if="isTwoLevel">
            <slot name="twoLevel"></slot>
          </view>
          <view class="refresher-tips" v-else>
            <slot name="refreshLevel">{{refreshStatusConf[rStatus]}}</slot>
          </view>
        </view>
      </view>
      <view v-else>
        <slot name="refreshLevel">
          <view class="flex-c-c">
            <loading :scale="0.5" :opacity="0.7"></loading>
          </view>
        </slot>
      </view>
    </view>
    <view class="relative">
      <slot></slot>
    </view>
    <view v-if="isEmpty && showEmpty && !hideScrollMsg" class="flex-c-c font-w6 font-blg" style="height: 50vh;">
      <view class="txt">{{emptyTxt || '暂无数据'}}</view>
    </view>
    <view class="tolower-more" v-if="hasMore && !isEmpty && !hideScrollMsg">
      <view class="flex-c-c">
        {{moreStatusConf[mStatus]}}
      </view>
    </view>
  </scroll-view>
</template>

<script>
  /**
   * 特效强化需要在 "renderer": "skyline"的情况下
  */
import { loading } from './loading.vue';
const app = getApp();
const baseOption = {
    components: { loading },
    props: {
      type: String,
      enhanced: Boolean,
      refresherThreshold: {
        type: Number,
        default: 50,
      },
      refresherTwoLevelThreshold: {
        type: Number,
        default: 150,
      },
      refresherEnabled: {
        type: Boolean,
        default: true,
      },
      refresherTwoLevelEnabled: Boolean,
      hasMoreAction: {
        type: Boolean,
        default: true,
      },
      hasMore: {
        type: Boolean,
        default: false,
      },
      scrollX: Boolean,
      scrollY: {
        type: Boolean,
        default: true,
      },
      showEmpty: {
        type: Boolean,
        default: true,
      },
      emptyTxt: String,
      customStyle: String,
      RefreshApi: Function,
      LoadMoreApi: Function,
      autoTriggered:{
        type: Boolean,
        default: true,
      },
      hideScrollMsg:Boolean,
      isEmpty:Boolean,
    },
    data() {
      return {
        randomTxt: new Date().getTime() + '',
        triggered: false,
        twoLevelTriggered: false,
        isTwoLevel: false,
        rStatus: 0,
        mStatus: 0,
        refreshStatusConf: {
          0: "下拉刷新",
          1: "刷新中",
          2: "刷新成功",
          3: "刷新失败"
        },
        moreStatusConf: {
          0: "加载更多",
          1: "加载中",
          2: "加载成功",
          3: "加载失败"
        },
        scrollContext: "",
        _freshing: false,
        _tolowering: false,
        //

      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init(page) {
        this._freshing = false;
      },
      onPulling(e) {
      },
      onRestore(e) {
      },
      onAbort(e) {
      },
      onRefresh(e) {
        this.triggered = true;
        this.$emit("onRefresh");
        if(this.autoTriggered){
          setTimeout(() => {
            this.closeRefresh();
          }, 1000);
        }
      },
      scrolltolower(e) {
        if (this.hasMore) {
          this.$emit("scrolltolower");
        } else {
          this.hasMoreAction && !this.hideScrollMsg && app.SMH.showToast({
            title: "已经到底了"
          })
        }
      },
      setRefeshState(state) {
        // state  0：初始状态，1：加载中...， 2: 加载成功，3:加载失败
        this.rStatus = state
        if (state > 1) {
          this.triggered = false;
          setTimeout(() => {
            this.rStatus = 0;
          }, 350)
        }
      },
      setMoreState(state) {
        // state  0：初始状态，1：加载中...， 2: 加载成功，3:加载失败
        this.mStatus = state;
      },
      closeRefresh() {
        this.triggered = false;
        // this.scrollContext?.closeRefresh({
        //   duration: 300,
        // })
        this._freshing = false;
      },
      closeTwoLevel() {
        this.twoLevelTriggered = false;
        // this.scrollContext?.closeTwoLevel({
        //   duration: 300,
        // })
      },
      onStatusChange(e) {
      },
    },
  }
  export default baseOption
</script>

<style lang="scss" scoped>
  .scroll_box {
    box-sizing: border-box;
  }

  .scroll-view {
    height: 100%;
  }

  .refresher-area {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 20rpx;
    text-align: center;
    color: #333;
  }

  .exp-room {
    width: 100vw;
    height: 100vh;

    .expand {
      width: 100%;
      height: 100%;
      position: relative;
      background-color: #3765A0;
    }

    .refresher-tips {
      position: absolute;
      left: 0px;
      bottom: 40rpx;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 24rpx;
    }
  }

  .tolower-more {
    padding: 20rpx;
    text-align: center;
  }
</style>