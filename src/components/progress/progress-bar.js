import { htmlOrText } from '../../utils/html'

// @vue/component
export default {
  name: 'BProgressBar',
  inject: {
    progress: {
      from: 'progress',
      default: function() {
        return {}
      }
    }
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: null
    },
    labelHTML: {
      type: String
    },
    // $parent prop values take precedence over the following props
    // Which is why they are defaulted to null
    max: {
      type: Number,
      default: null
    },
    precision: {
      type: Number,
      default: null
    },
    variant: {
      type: String,
      default: null
    },
    striped: {
      type: Boolean,
      default: null
    },
    animated: {
      type: Boolean,
      default: null
    },
    showProgress: {
      type: Boolean,
      default: null
    },
    showValue: {
      type: Boolean,
      default: null
    }
  },
  computed: {
    progressBarClasses() {
      return [
        this.computedVariant ? `bg-${this.computedVariant}` : '',
        this.computedStriped || this.computedAnimated ? 'progress-bar-striped' : '',
        this.computedAnimated ? 'progress-bar-animated' : ''
      ]
    },
    progressBarStyles() {
      return {
        width: 100 * (this.value / this.computedMax) + '%'
      }
    },
    computedProgress() {
      const p = Math.pow(10, this.computedPrecision)
      return Math.round((100 * p * this.value) / this.computedMax) / p
    },
    computedMax() {
      // Prefer our max over parent setting
      return typeof this.max === 'number' ? this.max : this.progress.max || 100
    },
    computedVariant() {
      // Prefer our variant over parent setting
      return this.variant || this.progress.variant
    },
    computedPrecision() {
      // Prefer our precision over parent setting
      return typeof this.precision === 'number' ? this.precision : this.progress.precision || 0
    },
    computedStriped() {
      // Prefer our striped over parent setting
      return typeof this.striped === 'boolean' ? this.striped : this.progress.striped || false
    },
    computedAnimated() {
      // Prefer our animated over parent setting
      return typeof this.animated === 'boolean' ? this.animated : this.progress.animated || false
    },
    computedShowProgress() {
      // Prefer our showProgress over parent setting
      return typeof this.showProgress === 'boolean'
        ? this.showProgress
        : this.progress.showProgress || false
    },
    computedShowValue() {
      // Prefer our showValue over parent setting
      return typeof this.showValue === 'boolean' ? this.showValue : this.progress.showValue || false
    }
  },
  render(h) {
    let childNodes = h(false)
    if (this.$slots.default) {
      childNodes = this.$slots.default
    } else if (this.label || this.labelHTML) {
      childNodes = h('span', { domProps: htmlOrText(this.labelHTML, this.label) })
    } else if (this.computedShowProgress) {
      childNodes = this.computedProgress.toFixed(this.computedPrecision)
    } else if (this.computedShowValue) {
      childNodes = this.value.toFixed(this.computedPrecision)
    }
    return h(
      'div',
      {
        staticClass: 'progress-bar',
        class: this.progressBarClasses,
        style: this.progressBarStyles,
        attrs: {
          role: 'progressbar',
          'aria-valuemin': '0',
          'aria-valuemax': this.computedMax.toString(),
          'aria-valuenow': this.value.toFixed(this.computedPrecision)
        }
      },
      [childNodes]
    )
  }
}
