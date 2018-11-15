<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      // 当组件中使用state中国的数据时，将state中的数据赋值计算属性
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      // 将store中getters中的属性扩展到计算属性中
      ...mapGetters([
        'singer'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        // 当歌手ID不存在时，让其跳转到歌手列表页面
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        // 通过songer的id来获得该歌手的详细信息
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data.list)
            /*
            *
            * res.data.list为该歌手的所有歌曲的详细信息(array)
            *
            * */
            processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          // 结构赋值musicData（将item中的musicData赋值给这里的musicData）为每一首歌的详细信息
          let {musicData} = item
          if (isValidMusic(musicData)) {
            // 将自定义的song储存在ret中
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
