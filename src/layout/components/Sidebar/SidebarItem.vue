<template>
  <div v-if="!item.hidden">
    <!-- template区域为sidebar-item组件 -->
    <!-- 一级菜单 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
            :path="item.path"
          />
          <span class="title"> {{ onlyOneChild.meta.title }} </span>
        </el-menu-item>
      </app-link>
    </template>
    <app-link v-else :to="resolvePath(item.path)">
      <el-menu-item
        :index="resolvePath(item.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <item
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
          :path="item.path"
        />
        <span class="title"> {{ item.meta.title }} </span>
      </el-menu-item>
    </app-link>
    <!-- <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
          :path="item.path"
        />
        <span class="title"> {{ item.meta.title }} </span>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu> -->
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: {
    Item,
    AppLink
  },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      submenuShow: 'isShow'
    }
  },
  methods: {
    // 存在一个路由
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // 临时设置（只有一个显示子项时使用）
          this.onlyOneChild = item
          return true
        }
      })

      // 当只有一个子路由器时，默认显示子路由器
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有要显示的子路由器，则显示父路由器
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped="scoped">
// .el-menu--collapse .el-submenu__title{
//   height: 85px!important;
// }
.el-submenu__title i {
  color: #ffffff;
}
.el-menu-item i {
  color: #ffffff;
}
.el-menu-item [class^='el-icon-'] {
  font-size: 24px;
  margin-right: 0px;
}
.el-menu--collapse li {
  text-align: center;
}

.openSidebar {
  .submenu-title-noDropdown,
  .el-submenu__title {
    height: 56px !important;
  }
  .title {
    display: none;
  }
}

.hideSidebar {
  .el-submenu__title {
    height: 85px !important;
  }
  .el-menu-item {
    height: 85px;
  }

  .el-menu--collapse {
    .title {
      display: block !important;
      font-size: 14px;
      margin-top: -27px;
      overflow: auto !important;
      visibility: visible !important;
      width: auto;
      height: 60px;
    }
  }

  .sidebar-container {
    width: 7% !important;
  }

  .el-menu--collapse span {
    display: block !important;
    font-size: 14px;
    margin-top: -27px;
    overflow: auto !important;
    visibility: visible !important;
    width: auto !important;
    height: 60px !important;
    line-height: 60px !important;
  }
  .el-submenu__title span:nth-of-type(1) {
    display: none !important;
  }
}

.el-menu--popup-right-start {
  .title {
    display: none;
  }
}
</style>
