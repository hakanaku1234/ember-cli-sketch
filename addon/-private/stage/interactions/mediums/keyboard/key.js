import EmberObject from '@ember/object';
import { readOnly, equal, or } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { serialized } from '../../../../util/computed';

const keys = {
  isEscape:     'Escape',
  isShift:      'Shift',
  isMeta:       'Meta',
  isAlt:        'Alt',
  isSpace:      ' ',
  isBackspace:  'Backspace',
  isDelete:     'Delete',
  isArrowUp:    'ArrowUp',
  isArrowDown:  'ArrowDown',
  isArrowLeft:  'ArrowLeft',
  isArrowRight: 'ArrowRight'
}

const properties = Object.keys(keys).reduce((hash, key) => {
  hash[key] = equal('key', keys[key]).readOnly();
  return hash;
}, {});

export default EmberObject.extend(assign({

  key: null,
  keyCode: null,

  isBackspaceOrDelete: or('isBackspace', 'isDelete'),

  isBody: readOnly('body'),

  serialized: serialized([ 'body', 'key', 'keyCode', ...Object.keys(keys) ])

}, properties));
