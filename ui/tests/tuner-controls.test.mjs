import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PitchMeter, NoteSelector, LevelMeter, SegmentedControl, SelectField, Button } from '../dist/index.js';

test('instrument controls render in SSR and expose measured cents and input level accessibly', () => {
  const html = renderToStaticMarkup(createElement('div', null,
    createElement(PitchMeter, { cents: -7.2 }),
    createElement(LevelMeter, { level: .5 }),
    createElement(NoteSelector, { notes: [{ id: '40', name: 'E', octave: 2, detail: '6' }], value: '40', onChange() {} }),
    createElement(SegmentedControl, { label: 'Mode', value: 'auto', options: [{ value: 'auto', label: 'Auto' }], onChange() {} }),
    createElement(SelectField, { label: 'Tuning', value: 'standard', onChange() {} }, createElement('option', { value: 'standard' }, 'Standard')),
    createElement(Button, { disabled: true }, 'Start'),
  ));
  assert.match(html, /Tuning deviation: -7.2 cents/);
  assert.match(html, /aria-valuenow="50"/);
  assert.match(html, /aria-label="6, E2"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /<label for="/);
  assert.match(html, /disabled=""/);
});
test('unavailable and nonfinite readings do not appear as valid tuning measurements', () => {
  for (const cents of [null, NaN, Infinity]) {
    const html = renderToStaticMarkup(createElement(PitchMeter, { cents }));
    assert.match(html, /no reading/);
    assert.doesNotMatch(html, /data-in-tune="true"/);
    assert.doesNotMatch(html, /NaN|Infinity/);
  }
});
