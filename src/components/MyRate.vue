<template>
  <div
    class="el-rate"
    role="slider"
    :aria-valuenow="currentValue"
    :aria-valuetext="text"
    aria-valuemin="0"
    :aria-valuemax="max"
    tabindex="0"
    @keydown="handleKey"
  >
    <span
      v-for="(item, key) in max"
      :key="key"
      class="el-rate__item"
      :style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
      @mousemove="setCurrentValue(item, $event)"
      @mouseleave="resetCurrentValue"
      @click="selectValue(item)"
    >
      <i
        :class="[classes[item - 1], { 'hover': hoverIndex === item }]"
        class="el-rate__icon star-item"
        :style="getIconStyle(item)"
      >
        <i
          v-if="showDecimalIcon(item)"
          :class="decimalIconClass"
          :style="decimalStyle"
          class="el-rate__decimal"
        />
      </i>
    </span>
    <span v-if="showText || showScore" class="el-rate__text star-text" :style="{ color: textColor }">{{ text }} 分</span>
  </div>
</template>

<script>
import { hasClass } from 'element-ui/src/utils/dom'
import { isObject } from 'element-ui/src/utils/types'
import Migrating from 'element-ui/src/mixins/migrating'

export default {
  // name: 'MyRate',
  mixins: [Migrating],
  inject: {
    elForm: {
      default: ''
    }
  },

  props: {
    // 绑定值    number    —    0
    value: {
      type: Number,
      default: 0
    },
    // 低分和中等分数的界限值，值本身被划分在低分中    number    —    2
    lowThreshold: {
      type: Number,
      default: 2
    },
    // 高分和中等分数的界限值，值本身被划分在高分中
    highThreshold: {
      type: Number,
      default: 4
    },
    // 最大分值    number    —    5
    max: {
      type: Number,
      default: 5
    },
    // icon 的颜色。若传入数组，共有 3 个元素，为 3 个分段所对应的颜色；若传入对象，可自定义分段，键名为分段的界限值，
    // 键值为对应的颜色    array/object    —    ['#F7BA2A', '#F7BA2A', '#F7BA2A']
    colors: {
      type: [Array, Object],
      default() {
        return ['#F7BA2A', '#F7BA2A', '#F7BA2A']
      }
    },
    // 未选中 icon 的颜色    string    —    #C6D1DE
    voidColor: {
      type: String,
      default: '#C6D1DE'
    },
    // 只读时未选中 icon 的颜色    string    —    #EFF2F7
    disabledVoidColor: {
      type: String,
      default: '#EFF2F7'
    },
    // icon 的类名。若传入数组，共有 3 个元素，为 3 个分段所对应的类名；若传入对象，可自定义分段，键名为分段的界限值，键值为对应的类名
    // array/object    —    ['el-icon-star-on', 'el-icon-star-on','el-icon-star-on']
    iconClasses: {
      type: [Array, Object],
      default() {
        return ['el-icon-star-on', 'el-icon-star-on', 'el-icon-star-on']
      }
    },
    // 未选中 icon 的类名    string    —    el-icon-star-off
    voidIconClass: {
      type: String,
      default: 'el-icon-star-off'
    },
    // 只读时未选中 icon 的类名    string    —    el-icon-star-on
    disabledVoidIconClass: {
      type: String,
      default: 'el-icon-star-on'
    },
    // 是否为只读
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否允许半选
    allowHalf: {
      type: Boolean,
      default: false
    },
    // 是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容
    showText: {
      type: Boolean,
      default: false
    },
    // 是否显示当前分数，show-score 和 show-text 不能同时为真
    showScore: {
      type: Boolean,
      default: false
    },
    // 辅助文字的颜色
    textColor: {
      type: String,
      default: '#1f2d3d'
    },
    // 辅助文字数组    array    —    ['极差', '失望', '一般', '满意', '惊喜']
    texts: {
      type: Array,
      default() {
        return ['极差', '失望', '一般', '满意', '惊喜']
      }
    },
    // 分数显示模板
    scoreTemplate: {
      type: String,
      default: '{value}'
    }
  },

  data() {
    return {
      // 鼠标在目标元素一半的左侧
      pointerAtLeftHalf: true,
      // 当前值
      currentValue: this.value,
      hoverIndex: -1
    }
  },

  computed: {
    // 文本
    text() {
      let result = ''
      if (this.showScore) {
        result = this.scoreTemplate.replace(/\{\s*value\s*\}/, this.rateDisabled
          ? this.value
          : this.currentValue * 2)
      } else if (this.showText) {
        result = this.texts[Math.ceil(this.currentValue) - 1]
      }
      return result
    },
    // 样式
    decimalStyle() {
      let width = ''
      if (this.rateDisabled) {
        // 差值
        width = `${this.valueDecimal}%`
      } else if (this.allowHalf) {
        // 半星
        width = '50%'
      }
      return {
        color: this.activeColor,
        width
      }
    },
    // 差值
    valueDecimal() {
      return this.value * 100 - Math.floor(this.value) * 100
    },
    // 字典
    classMap() {
      return Array.isArray(this.iconClasses)
        ? {
          [this.lowThreshold]: this.iconClasses[0],
          [this.highThreshold]: { value: this.iconClasses[1], excluded: true },
          [this.max]: this.iconClasses[2]
        } : this.iconClasses
    },
    // 根据值获取类名
    decimalIconClass() {
      return this.getValueFromMap(this.value, this.classMap)
    },
    // 未选中的类名
    voidClass() {
      return this.rateDisabled ? this.disabledVoidIconClass : this.voidIconClass
    },
    // 获取当前值的类名
    activeClass() {
      return this.getValueFromMap(this.currentValue, this.classMap)
    },
    // 颜色字典
    colorMap() {
      return Array.isArray(this.colors)
        ? {
          [this.lowThreshold]: this.colors[0],
          [this.highThreshold]: { value: this.colors[1], excluded: true },
          [this.max]: this.colors[2]
        } : this.colors
    },
    // 当前的颜色
    activeColor() {
      return this.getValueFromMap(this.currentValue, this.colorMap)
    },

    classes() {
      const result = []
      let i = 0
      let threshold = this.currentValue
      if (this.allowHalf && this.currentValue !== Math.floor(this.currentValue)) {
        threshold--
      }
      for (; i < threshold; i++) {
        result.push(this.activeClass)
      }
      for (; i < this.max; i++) {
        result.push(this.voidClass)
      }
      return result
    },
    // 是否只读
    rateDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },

  watch: {
    // 监听value变化赋值给currentValue
    value(val) {
      this.currentValue = val
      this.pointerAtLeftHalf = this.value !== Math.floor(this.value)
    }
  },
  // 初始化
  created() {
    if (!this.value) {
      this.$emit('input', 0)
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'text-template': 'text-template is renamed to score-template.'
        }
      }
    },
    // 根据字典获取类名
    getValueFromMap(value, map) {
      const matchedKeys = Object.keys(map)
        .filter(key => {
          const val = map[key]
          const excluded = isObject(val) ? val.excluded : false
          return excluded ? value < key : value <= key
        })
        .sort((a, b) => a - b)
      const matchedValue = map[matchedKeys[0]]
      return isObject(matchedValue) ? matchedValue.value : (matchedValue || '')
    },
    // 显示icon
    showDecimalIcon(item) {
      // 禁用是否显示
      const showWhenDisabled = this.rateDisabled && this.valueDecimal > 0 && item - 1 < this.value && item > this.value
      /* istanbul ignore next */
      const showWhenAllowHalf = this.allowHalf &&
          this.pointerAtLeftHalf &&
          item - 0.5 <= this.currentValue &&
          item > this.currentValue
      return showWhenDisabled || showWhenAllowHalf
    },
    // 获取每个item的颜色
    getIconStyle(item) {
      const voidColor = this.rateDisabled ? this.disabledVoidColor : this.voidColor
      return {
        color: item <= this.currentValue ? this.activeColor : voidColor
      }
    },
    // 设置值
    selectValue(value) {
      if (this.rateDisabled) {
        return
      }
      if (this.allowHalf && this.pointerAtLeftHalf) {
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue)
      } else {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    },
    // 键盘事件
    handleKey(e) {
      // 只读返回
      if (this.rateDisabled) {
        return
      }
      let currentValue = this.currentValue
      const keyCode = e.keyCode
      // 上箭头和右箭头
      if (keyCode === 38 || keyCode === 39) {
        // 允许半星增加0.5
        if (this.allowHalf) {
          currentValue += 0.5
        } else {
          // 否则增加1
          currentValue += 1
        }
        e.stopPropagation()
        e.preventDefault()
        // 左箭头和下箭头,同理
      } else if (keyCode === 37 || keyCode === 40) {
        if (this.allowHalf) {
          currentValue -= 0.5
        } else {
          currentValue -= 1
        }
        e.stopPropagation()
        e.preventDefault()
      }
      currentValue = currentValue < 0 ? 0 : currentValue
      currentValue = currentValue > this.max ? this.max : currentValue
      // 向外抛出chang和input事件,并传当前值
      this.$emit('input', currentValue)
      this.$emit('change', currentValue)
    },
    // 设置当前值
    setCurrentValue(value, event) {
      // 只读则返回
      if (this.rateDisabled) {
        return
      }
      /* istanbul ignore if */
      // 允许半星
      if (this.allowHalf) {
        let target = event.target
        if (hasClass(target, 'el-rate__item')) {
          target = target.querySelector('.el-rate__icon')
        }
        if (hasClass(target, 'el-rate__decimal')) {
          target = target.parentNode
        }
        // 鼠标在左半星减去半星,否则不变
        this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth
        this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value
      } else {
        // 直接赋值
        this.currentValue = value
      }
      this.hoverIndex = value
    },
    // 重置当前值
    resetCurrentValue() {
      // 只读则返回
      if (this.rateDisabled) {
        return
      }
      // 允许半星
      if (this.allowHalf) {
        this.pointerAtLeftHalf = this.value !== Math.floor(this.value)
      }
      this.currentValue = this.value
      this.hoverIndex = -1
    }
  }
}
</script>

<style scoped>
  .star-item{
    font-size: 25px;
  }
  .star-text{
    font-size: 17px;
    font-weight: normal;
    position: relative;
    top:1px
  }
</style>
