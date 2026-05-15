/**
 * 首页长页各区块：与视口有交集时 sectionAnimActive=true，用于暂停离屏 RAF/CSS 动画。
 * rootMargin 略扩大，减少进出边界时的闪烁。
 */
export default {
  data() {
    return {
      sectionAnimActive: true,
    };
  },
  mounted() {
    this._bindSectionViewportObserver();
  },
  beforeDestroy() {
    if (this._sectionViewportObserver) {
      this._sectionViewportObserver.disconnect();
      this._sectionViewportObserver = null;
    }
  },
  methods: {
    _bindSectionViewportObserver() {
      const el = this.$el;
      if (!el || typeof IntersectionObserver === 'undefined') {
        return;
      }
      this._sectionViewportObserver = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          this.sectionAnimActive = e ? e.isIntersecting : true;
        },
        {
          root: null,
          threshold: 0,
          rootMargin: '72px 0px 72px 0px',
        },
      );
      this._sectionViewportObserver.observe(el);
    },
  },
};
