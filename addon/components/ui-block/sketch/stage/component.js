import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import EventsMixin from './-events-mixin';
import ReadyMixin from './-ready';
import { style, className } from './-computed';

const isSketchComponent = '__isSketchComponent';

export const getSketchComponent = component => {
  if(!component || component[isSketchComponent]) {
    return component;
  }
  return getSketchComponent(component.parentView);
};

export default Component.extend(EventsMixin, ReadyMixin, {
  classNameBindings: [ ':ui-block-sketch-stage', 'fill', '_isReady:ready:loading' ],
  attributeBindings: [ 'style' ],
  layout,

  [isSketchComponent]: true,

  size: null,

  fill: className('stage.fill', 'fill'),
  elementSize: null,

  stage: computed({
    get() {
      return this._stage;
    },
    set(_, value) {
      let current = this._stage;
      if(current !== value) {
        if(current) {
          this.detachStage(current);
        }
        if(value) {
          this.attachStage(value);
        }
        this._stage = value;
      }
      return value;
    }
  }),

  cursor: readOnly('stage.node.cursor.value'),

  style: style('cursor', 'size', function() {
    let { cursor, size } = this;
    let props = {
      cursor
    };
    if(size) {
      let px = key => `${Math.ceil(size[key])}px`;
      props.width = px('width');
      props.height = px('height');
    }
    return props;
  }),

  didInsertElement() {
    this._super(...arguments);
    this.focus();
    this.notifyReady(this.stage);
  },

  notifyReady(stage) {
    let { ready } = this;
    if(!stage || !ready) {
      return;
    }
    ready(stage);
    this.registerAfterRenderPromise();
  },

  detachStage(stage) {
    stage.node.detach();
  },

  attachStage(stage) {
    stage.node.attach(this);
    if(this.element) {
      this.notifyReady(stage);
    }
  },

  focus() {
    let element = document.activeElement;
    if(element) {
      document.activeElement.blur();
    }
  },

  recalculateSize() {
    this.elementSizeDidChange();
  }

});
