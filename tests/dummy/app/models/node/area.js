import Base, { node, x, y, width, height, visible, selectable, aspect, attr } from './-base';
import { computed } from '@ember/object';

export default Base.extend({

  node: node({ type: 'sized', container: true }),

  x:       x(),
  y:       y(),
  width:   width({ min: 100, max: 500 }),
  height:  height({ min: 100, max: 300 }),
  aspect:  aspect(),

  visible:    visible(),
  selectable: selectable(),

  fill: attr('fill', { type: 'string', initial: '#fff' }),

  accessories: computed('cropMarks', 'cropMarksInset', function() {
    let { cropMarks, cropMarksInset } = this;
    if(cropMarks) {
      return [
        { type: 'crop-marks', inset: cropMarksInset }
      ];
    }
  }).readOnly(),

  cropMarks:      attr('cropMarks', { type: 'boolean', initial: true }),
  cropMarksInset: attr('cropMarksInset', { type: 'number', min: 0, max: 25, initial: 0 }),

  hasFill: true,
  hasCropMarks: true,

});
