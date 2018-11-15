<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!--确保slider组件中的solt里面有内容时，才执行_setSliderWidth方法-->
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <!--内容将会被插入到slider组件的solt中-->
            <div v-for="(item,index) in recommends">
              <a :href="item.linkUrl">
                <!--当点击该图片时，fastClick就会监听该图片是否有deedsclick，若有，fastclick就不会拦截这个点击事件-->
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item,index) in discList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import { getRecommend, getDiscList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  export default {
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      // 获得轮播图的数据
      this._getRecommend()

      // 获得歌单列表的数据
      this._getDiscList()
    },
    methods: {
      // 在组件内部使用的方法用'_'来进行命名
      _getRecommend() {
        // 由于getRecommend方法返回的是一个Promise对象
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          this.discList = res.data.list
        })
      },
      loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkloaded = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
