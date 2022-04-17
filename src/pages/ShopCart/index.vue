<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked"
              @change="updateChecked(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cartPrice(cart) }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="
                handler('minus', -1, cart)
                fix(cart.skuNum)
              "
              :style="{ 'pointer-events': none }"
              >-</a
            >
            <input
              autocomplete="off"
              type="number"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              minnum="1"
              class="itxt"
              :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)"
              ref="input"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="
                handler('add', 1, cart)
                fix2(cart.skuNum)
              "
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{
              (cart.skuNum * cart.cartPrice).toFixed(2)
            }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllCheck&&cartInfoList.length>0"
          :disabled="cartInfoList.length==0"
          @change="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" @click="$router.push('/trade')">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { throttle, debounce } from 'lodash'
export default {
  name: 'ShopCart',
  data() {
    return {
      none: '',
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    //获取个人购物车数据
    getData() {
      this.$store.dispatch('getCartList')
    },
    //修改某一个产品的个数
    handler: throttle(async function (type, disNum, cart) {
      //type:为了区分是+按钮触发还是-按钮触发还是input框触发
      //disNum:+按钮传1，-按钮传-1，input框传的是变化后的值
      //cart:该商品的信息，即cartList中的某一项
      //向服务器发请求，修改数量
      switch (type) {
        //加号
        case 'add':
          disNum = 1
          break
        //减号
        case 'minus':
          //产品输了大于1，则传给服务器-1（数量减1）
          //小于等于1，则传给服务器0（不增不减）
          disNum = cart.skuNum > 1 ? -1 : 0
          break
        case 'change':
          if (disNum == 0) {
            disNum = 0
          } else {
            disNum = disNum - cart.skuNum
          }
      }
      //派发action
      try {
        if (disNum == 0) {
          this.none = 'none'
          return
        } else {
          await this.$store.dispatch('addOrUpdateShopCart', {
            skuId: cart.skuId,
            skuNum: disNum,
          })
          //再次获取服务器最新数据进行展示
          this.getData()
        }
      } catch (error) {}
    }, 200),
    //删除购物车的某一个产品
    async deleteCartById(cart) {
      try {
        //如果删除成功，再次发起请求获取新的数据
        await this.$store.dispatch('deleteCartListBySkuId', cart.skuId)
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    //修改某一个产品的勾选状态
    async updateChecked(cart, e) {
      try {
        let isChecked = e.target.checked ? 1 : 0
        await this.$store.dispatch('updateCheckedById', {
          skuId: cart.skuId,
          isChecked,
        })
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    //删除全部选中的商品
    //没办法传参
    async deleteAllCheckedCart() {
      try {
        //派发一个action
        await this.$store.dispatch('deleteAllCheckedCart')
        //再次发请求获取最新数据
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    async updateAllCartChecked(e) {
      try {
        let isChecked = e.target.checked ? '1' : '0'
        //派发action
        await this.$store.dispatch('updateAllCartIsChecked', isChecked)
        //再次发请求获取数据
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    //在数量减到1时，禁用减号按钮
    fix(x) {
      // console.log(x)
      if (x == 2) {
        this.none = 'none'
      }
      // })
    },
    //在数量大于1时，启用减号按钮
    fix2(x) {
      // console.log(x)
      this.none = ''
    },
    cartPrice(cart){
      if(!cart.cartPrice)
      return cart.cartPrice.toFixed(2)
    }
  },
  computed: {
    ...mapGetters(['cartList']),
    //购物车数据
    cartInfoList() {
      //如果数据还没返回，则this.cartList为空对象，它的cartInfoList就为undefined
      //所以至少给一个空数组，不会报错
      return this.cartList.cartInfoList || []
    },
    //计算产品总价
    totalPrice() {
      let sum = 0
      this.cartInfoList.forEach((item) => {
        if (item.isChecked == 1) {
          sum += item.skuNum * item.cartPrice
        }
      })
      return sum.toFixed(2)
    },
    //判断底部复选框是否勾选（全部商品勾选则勾选）
    isAllCheck() {
      //every方法，都满足为真，否则为假
      //遍历数组元素，只要全部元素的isChecked为1，则为真
      return this.cartInfoList.every((item) => item.isChecked == 1)
    },
  },
}
</script>

<style lang="less" scoped>
/*** 消除input元素 type="number" 时默认的 加减按钮*/
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
input[type='number'] {
  -moz-appearance: textfield;
}
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        // .cart-list-con3 {
        //   width: 20.8333%;

        //   .item-txt {
        //     text-align: center;
        //   }
        // }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>