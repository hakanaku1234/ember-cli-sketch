import Component from '@ember/component';
import layout from './template';
import { readOnly, or } from '@ember/object/computed';
import { frame } from '../../-computed';

const disabled = key => readOnly(`constraints.${key}.isNotResizable`);

export default Component.extend({
  layout,
  classNameBindings: [ ':ui-block-sketch-selections-selection' ],
  attributeBindings: [ 'style' ],

  stage: readOnly('node.stage'),
  resizing: readOnly('stage.resizing'),

  constraints: readOnly('node.constraints'),

  horizontal: disabled('horizontal'),
  vertical:   disabled('vertical'),

  isTopLeftDisabled:      or('vertical', 'horizontal'),
  isTopRightDisabled:     or('vertical', 'horizontal'),
  isBottomLeftDisabled:   or('vertical', 'horizontal'),
  isBotomRightDisabled:   or('vertical', 'horizontal'),

  isTopMiddleDisabled:    or('vertical'),
  isBottomMiddleDisabled: or('vertical'),
  isMiddleLeftDisabled:   or('horizontal'),
  isMiddleRightDisabled:  or('horizontal'),

  style: frame('node', 'selection', { inset: -1 }),

  actions: {
    enter(edge) {
      let { resizing, node } = this;
      resizing.bind(node, edge);
    },
    leave() {
      this.resizing.unbind();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.resizing && this.resizing.unbind();
  }

});