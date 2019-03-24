import Base from '../-base';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { sketches } from '../../../services/sketches';
import { omit } from '../../../util/object';
import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';

const {
  keys
} = Object;

export const frame = (type='node') => computed(function() {
  return sketches(this).factory.stage.frame(type, this);
}).readOnly();

const split = opts => {
  if(!opts) {
    return {};
  }
  let { frame, constraints } = opts;
  let props = omit(opts, [ 'frame' ]);
  return { frame, constraints, props };
};

export const FrameMixin = Mixin.create({

  prepare(opts) {
    let { frame, props } = split(opts);
    this._super(props);
    if(this.frame) {
      this.frame.prepare(frame);
    }
  }

});

export default Base.extend({

  exists: true,

  deltaToFrame(props) {
    let values = {};
    keys(props).forEach(key => {
      let value = props[key];
      if(value !== undefined) {
        values[key] = this[key] + props[key];
      } else {
        values[key] = this[key];
      }
    });
    return values;
  },

  update(props, opts) {
    let { delta } = assign({ delta: false }, opts);
    if(delta) {
      let values = this.deltaToFrame(props);
      this.setProperties(values);
    } else {
      this.setProperties(props);
    }
  },

  convertPointFromParent(point) {
    return {
      x: point.x - this.x,
      y: point.y - this.y
    };
  },

  includesPosition({ x, y }, frameKey='serialized') {
    let frame = this[frameKey];
    assert(`frame ${frameKey} not declared`, !!frame);
    return frame.x <= x && frame.y <= y && frame.x + frame.width >= x && frame.y + frame.height >= y;
  },

  includesFrame({ x, y, width, height }, frameKey='serialized') {
    let frame = this[frameKey];
    assert(`frame ${frameKey} not declared`, !!frame);
    return x >= frame.x && y >= frame.y && x + width <= frame.x + frame.width && y + height <= frame.y + frame.height;
  }

});
