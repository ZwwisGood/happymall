<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">
      上一页
    </button>
    <button v-show="startNumAndEndNum.start > 1" @click="$emit('getPageNo', 1)" :class="{active:pageNo==1}">
      1
    </button>
    <button v-show="startNumAndEndNum.start > 2">···</button>

    <!-- 分页器中间部分（连续页数） -->
    <button
      v-for="(page, index) in startNumAndEndNum.end"
      :key="index"
      v-show="page >= startNumAndEndNum.start"
      @click="$emit('getPageNo', page)"
      :class="{ active: pageNo == page }"
    >
      {{ page }}
    </button>

    <button v-show="startNumAndEndNum.end <= totalPage - 2">···</button>
    <button
      v-show="startNumAndEndNum.end < totalPage"
      @click="$emit('getPageNo', totalPage)"
    >
      {{ totalPage }}
    </button>
    <button :disabled="pageNo == totalPage" @click="$emit('getPageNo', pageNo +1)">下一页</button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  //父组件传递给子组件的数据：当前页数、每一页数据数、数据总数、连续的页码数
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    //总页数：通过总数据数 / 每页数据数 向上取整
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },
    //计算出连续的页码的起始数字和结束数字【continues连续页码：5】
    startNumAndEndNum() {
      const { continues, pageNo, totalPage } = this
      //先定义两个变量存储起始数字和结束数字
      let start = 0,
        end = 0
      //如果总页数小于5页，只显示这5页
      if (continues > totalPage) {
        start = 1
        end = totalPage
      } else {
        //如果总页数大于5页，显示连续5页
        start = pageNo - Math.floor(continues / 2)
        end = pageNo + Math.floor(continues / 2)
        //如果当前页数为第1、第2页，算出start会有0或1，判断解决
        //即如果当前为第1、2页，分页器显示1-5页
        if (start < 1) {
          start = 1
          end = continues
        }
        //同理end算出来可能大于总页数
        if (end > totalPage) {
          end = totalPage
          start = totalPage - continues + 1
        }
      }
      return { start, end }
    },
  },
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
