import Actions, { model } from './-actions';

const node = type => model(`node/${type}`);

export default Actions.extend({

  drag: node('drag'),

});