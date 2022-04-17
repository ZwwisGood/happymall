<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件委托 -->
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动 -->
        <!-- 过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="show">
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
                v-show="c1.categoryId<16"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                  <!-- 编程式导航会出现卡顿，服务器返回数据之后，一瞬间循环出现很多router-link组件，所以会卡顿。 -->
                  <!-- <router-link to="/search">{{ c1.categoryName }}</router-link> -->
                </h3>
                <!-- 二级、三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em
                          v-for="c3 in c2.categoryChild"
                          :key="c3.categoryId"
                        >
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">欢乐购超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
//引入方式：是把lodash全部功能函数引入
// import _ from 'lodash'
//按需加载
import { throttle } from 'lodash'
export default {
  name: 'TypeNav',
  data() {
    return {
      currentIndex: -1,
      show: true,
    }
  },
  //组件挂载完毕，可以向服务器发请求
  mounted() {
    //如果不是Home路由组件，将typeNav隐藏
    if (this.$route.path != '/home') {
      this.show = false
    }
  },
  computed: {
    ...mapState({
      categoryList: (state) => state.home.categoryList,
    }),
  },
  methods: {
    // changeIndex(index) {
    //   //鼠标移上某一个一级分类的元素索引值
    //   this.currentIndex = index
    // },
    //throttle回调函数别用箭头函数
    changeIndex: throttle(function (index) {
      this.currentIndex = index
    }, 20),
    //一级分类鼠标移出事件回调
    leaveShow() {
      this.currentIndex = -1
      //鼠标离开，商品分类隐藏（搜索页）
      if (this.$route.path != '/home') {
        this.show = false
      }
    },
    enterShow() {
      //鼠标进入，商品分类显示（搜索页）
      this.show = true
    },
    goSearch(e) {
      //最好的解决办法：编程式导航 + 事件委派
      //存在问题：如何确定点的是a标签、如何区分一级、二级、三级分类标签

      //第一个问题：把子节点当中a标签，加上自定义属性data-categoryName
      let element = e.target
      let { categoryname, category1id, category2id, category3id } =
        element.dataset
      // console.log(category1id, category2id, category3id)
      //有分类名称，进入下一步判断
      if (categoryname) {
        let location = { name: 'search' }
        let query = { categoryName: categoryname }
        //判断是哪级分类
        if (category1id) query.category1Id = category1id
        else if (category2id) query.category2Id = category2id
        else if (category3id) query.category3Id = category3id
        //整理完参数，合并
        //合并params参数
        location.query = query
        location.params = this.$route.params
        //路由跳转
        this.$router.push(location)
      }
    },
  },
}
</script>

<style scoped lang="less">
a {
  cursor: pointer;
}
a:hover {
  text-decoration: underline;
}
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30.7px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background: rgb(168, 119, 119);
        }
      }
    }

    //过渡动画样式
    //开始状态（进入）
    .sort-enter {
      opacity: 0;
    }
    //结束状态（进入）
    .sort-enter-to {
      opacity: 1;
    }
    //动画时间、速率
    .sort-enter-active {
      transition: all 0.5s;
    }
  }
}
</style>