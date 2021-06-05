<template>
  <!-- 分页器组件封装-->
  <div id="pagination" :class="theme">
    <el-pagination
      :current-page="currentPageRef"
      background
      :page-size="pageSizeRef"
      layout="total, prev, pager, next"
      :total="allCountRef"
      @current-change="handleCurrentChangeRef"
    />
  </div>
</template>

<script>
import { ref, reactive, defineComponent, toRefs, toRef, computed } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 总条数
    allCount: {
      type: Number,
      default: 1000
    },
    // 一页的尺寸
    pageSize: {
      type: Number,
      default: 10
    }
  },
  emits: ['handleCurrentChange'],
  setup(props, context) {
    const store = useStore()
    const theme = computed(() => {
      return store.getters['header/getTheme']
    })
    const allCountRef = toRef(props, 'allCount') // 针对单个相应式数据
    const currentPageRef = toRef(props, 'currentPage') // 针对单个相应式数据
    const pageSizeRef = toRef(props, 'pageSize') // 针对单个相应式数据
    const handleCurrentChangeRef = (changeSize) => {
      context.emit('handleCurrentChange', changeSize)
    }
    return {
      theme,
      allCountRef,
      currentPageRef,
      pageSizeRef,
      handleCurrentChangeRef
    }
  }
}
</script>

<style lang="scss" scoped>
// 分页器设置
#pagination.dark {
  &::v-deep(.el-pagination) {
    background-color: transparent;
    // 内部所有样式重置
    span,
    li,
    i {
      color: #c9d1d9;
    }
    // 小按钮颜色重置
    .el-pager {
      li {
        background-color: #012840;
        &:hover {
          color: #4ca1ec;
          background-color: #090c10;
        }
      }
      li.active {
        color: #4ca1ec;
        background-color: #090c10;
      }
    }
    button {
      background-color: transparent;
      &:hover {
        background-color: #090c10;
      }
    }
  }
}
#pagination.light {
  &::v-deep(.el-pagination) {
    background-color: transparent;
    // 内部所有样式重置
    span,
    li,
    i {
      color: #000;
    }
    // 小按钮颜色重置
    .el-pager {
      li {
        background-color: #e1e7f0;
        &:hover {
          background-color: #b2c7e9;
        }
      }
      li.active {
        background-color: #b2c7e9;
      }
    }
    button {
      background-color: transparent;
      &:hover {
        background-color: #b2c7e9;
      }
    }
  }
}
</style>
