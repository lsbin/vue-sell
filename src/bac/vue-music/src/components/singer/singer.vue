<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'

  let HOT_NAME = '热门'
  let HOT_SINGER_LEN = 10
  export default{
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      // 监听listView派发出来的事件，来进行路由的跳转
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
            console.log(1)
          }
        })
      },
      _normalizeSinger(list) {
        // 创建一个map数据，用来储存处理后的数据
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        // 遍历获得的数据，进行聚合处理
        list.forEach((item, index) => {
          // 热门数据的处理
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }

          // 外部ABC字母部分的处理
          const key = item.Findex

          // 若map中没有key,则将key作为map的key
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          // map中已经存在key，就将该key对应的item放在该key对应的item中
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })

        // 为了得到有序数据，需要处理map
        // 储存热门
        let hot = []

        // 储存字母部分
        let ret = []

        for (let key in map) {
          let val = map[key]

          // 若val.title为字母时，将val放进ret中
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }

        // 对字母部分按照title进行排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }

    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
