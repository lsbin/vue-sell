<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <!--当外部引用slider组件时，slider组件所包的内容会被插入到solt插槽中-->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex===index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom'
  export default{
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      // 保证DOM渲染完毕
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoplay) {
          this._play()
        }
      }, 20)

      // 当窗口大小发生变化时，重新计算item的宽度并刷新BScroll
      window.addEventListener('resize', () => {
        // 如果this.slider不存在时的处理
        if (!this.slider) {
          return
        }

        // 当this.slider存在时，重新计算item的宽度并刷新BScroll
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      // 自动播放
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      },
      _initDots() {
        // 给dots的个数赋值
        this.dots = new Array(this.children.length)
      },
      _setSliderWidth(isResize) {
        // 需要滚动的item的个数
        this.children = this.$refs.sliderGroup.children

        // 用于储存item的容器的宽度
        let width = 0

        // slider的wrapper的宽度的获取
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          // 获得每一个滚动的item
          let child = this.children[i]

          // 给每一个item添加样式
          addClass(child, 'slider-item')

          // 设置每一个item的宽度
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }

        // 由于BScroll在loop模式下会给item前和后分别添加一个item，所以给item的容器的宽度也加2个item的宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }

        // 设置item容器的宽度
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        // 监听scroll，以便获得当前正在滚动的item
        this.slider.on('scrollEnd', () => {
          // 通过BScroll下的方法获得正在滚动的item的index
          let pageIndex = this.slider.getCurrentPage().pageX

          // 由于在loop模式下，BScroll会自动在item的前面和后面添加一个item，所以应该让pageIndex-1
          if (this.loop) {
            pageIndex -= 1
          }

          // 设置当前滚动item的索引
          this.currentPageIndex = pageIndex

          // 自动播放模式的处理
          if (this.autoplay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      }
    },
    destroyed() {
      // 来回切换的时候，Vue会调用该方法，有利于内存的释放
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
