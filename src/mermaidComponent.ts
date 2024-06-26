import {defineComponent, h, PropType} from 'vue';
import mermaid, {Config} from 'mermaid';

type Theme = 'dark' | 'default' | 'forest' | 'neutral' | 'null';

const MermaidComponent = defineComponent({
  name: 'Mermaid',
  props: {
    id: {
      type: String,
      required: false,
      default() {
        return 'diagram_' + Date.now();
      }
    },
    graph: {
      type: String,
      required: true
    },
    style: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },
    theme: {
      type: String as PropType<Theme>,
      default: 'default',
    },
    themeVariables: {
      type: Object,
      default: () => {
        return {
          primaryColor: '#409eff',
          darkMode: false,
        };
      }
    },
  },
  render(props: { id: string; graph: string; style: object; theme: Theme; themeVariables: object; }) {
    const style = {
      width: '100%',
      ...props.style
    };

    return h('div', {
      style,
      class: 'cl-mermaid',
    }, []);
  },
  data(): { observer?: MutationObserver; darkMode: boolean } {
    return {
      observer: undefined,
      darkMode: false,
    };
  },
  methods: {
    updateDarkMode() {
      const html = document.querySelector('html');
      if (!html) return;
      if (
        (html.getAttribute('class')?.indexOf('dark') || -1) > -1 ||
        (html.getAttribute('data-theme')?.indexOf('dark') || -1) > -1
      ) {
        this.darkMode = true;
        return;
      }
      this.darkMode = false;
    },
    renderGraph() {
      const element = this.$el;
      mermaid.initialize({
        startOnLoad: true,
        theme: this.theme,
        themeVariables: {
          ...this.themeVariables,
          darkMode: this.darkMode,
        },
      } as Config);
      mermaid.render(this.id, decodeURIComponent(this.graph), (svgCode: any) => {
        element.innerHTML = svgCode;
      });
    },
  },
  computed: {
    html() {
      return document.querySelector('html');
    }
  },
  mounted() {
    this.observer = new MutationObserver(() => {
      this.updateDarkMode();
      this.renderGraph();
    });
    if (!this.html) return;
    this.observer?.observe(this.html, {attributes: true});

    setTimeout(() => {
      this.updateDarkMode();
      this.renderGraph();
    }, 0);
  },
  unmounted() {
    this.observer?.disconnect();
  },
});

export {MermaidComponent};
