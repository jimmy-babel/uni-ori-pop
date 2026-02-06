<template>
    <view class="close-btn-box flex-c-c" :style="viewStyle" @click.stop="emit('close')">
        <view class='close-btn relative'>
            <div class="x-line absolute vertical"></div>
            <div class="x-line absolute horizontal"></div>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    const pageOption = {
        components: {},
        props: {
            color: {
                type: String,
                default: '#7f7f7f'
            },
            size: {
                type: Number,
                default: 43
            },
            borderW: Number,
            bgColor: String,
        },
        data() {
            return {
            }
        },
        computed:{
            viewStyle(){
                let style = `--close-color:${this.color};`;
                this.borderW && (style += `--border-w:${this.borderW}rpx;--border-color: ${this.borderW ? this.color : 'transparent'};`)
                this.bgColor && (style += `--close-bg: ${this.bgColor};`);
                this.size && (style += `--close-size: ${this.size}rpx;`);
                return style
            }
        },
        methods: {
        },
    }
    export default pageOption;
</script>
<style lang='scss' scoped>
.close-btn-box{
    padding: 10rpx;
    .close-btn {
        width: var(--close-size, 43rpx);
        height: var(--close-size, 43rpx);
        border: var(--border-w, 2px) solid var(--border-color);
        border-radius: 100%;
        background: var(--close-bg);
        .x-line {
            width: 80%;
            height: var(--border-w, 2px);
            top: 50%;
            left: 50%;
            border-radius: 5rpx;
            background-color: var(--close-color, #7f7f7f);
            transform-origin: center;
        }

        .x-line.vertical {
            transform: translate(-50%, -50%) rotate(45deg);
        }

        .x-line.horizontal {
            transform: translate(-50%, -50%) rotate(-45deg);
        }
    }
}
</style>