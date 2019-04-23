import Mixin from '@ember/object/mixin';
import { array } from '../../../../-private/util/computed';
import safe from '../../../../-private/util/safe';
import { schedule, cancel } from '@ember/runloop';
import { Promise, resolve } from 'rsvp';
import { next } from '../../../../-private/util/runloop';

const afterRender = () => new Promise(resolve => schedule('afterRender', resolve));

export default Mixin.create({
  classNameBindings: [ '_isReady:ready:loading' ],

  _promises: array(),
  _isReady: false,

  didInsertElement() {
    this._super(...arguments);
    this._scheduleUpdateIsReady();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._cancelScheduleIsReady();
  },

  registerAfterRenderPromise: safe(function() {
    this.registerRenderPromise(afterRender());
  }),

  _cancelScheduleIsReady() {
    cancel(this.__updateIsReady);
    cancel(this.__updateIsReadyActions);
  },

  _updateIsReady: safe(function() {
    let resolved = this._promises.length === 0;
    let stage = this.stage;
    let _isReady = resolved && !!stage;
    if(this._isReady === _isReady) {
      return;
    }
    this.setProperties({ _isReady });
  }),

  _scheduleUpdateIsReady() {
    this._cancelScheduleIsReady();
    this.__updateIsReady = schedule('afterRender', () => {
      if(this.isDestroying) {
        return;
      }
      cancel(this.__updateIsReadyActions);
      this.__updateIsReadyActions = schedule('actions', () => this._updateIsReady());
    });
  },

  registerRenderPromise: safe(function(promise) {
    promise = resolve(promise).then(() => next());

    this._cancelScheduleIsReady();

    this._promises.pushObject(promise);
    this._updateIsReady();

    resolve(promise).then(() => {}, () => {}).finally(() => {
      if(this.isDestroying) {
        return;
      }
      this._promises.removeObject(promise);
      this._scheduleUpdateIsReady();
    });
  })

});
