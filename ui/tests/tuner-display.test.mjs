import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TunerDisplay, BrandLink } from '../dist/index.js';

test('tuner readout preserves the measured frequency and detuning without snapping', () => {
  const html = renderToStaticMarkup(createElement(TunerDisplay, {
    note: { name: 'A', octave: 4 }, frequency: 438.22, cents: -7, active: true, listening: true,
  }));
  assert.match(html, /Detected note A4/);
  assert.match(html, />438\.22</);
  assert.match(html, /Tuning deviation: -7\.0 cents/);
  assert.match(html, /Tune up/);
  assert.doesNotMatch(html, />440\.00</);
});
test('idle and invalid readings stay unmeasured, while in-tune status requires valid live evidence', () => {
  const idle = renderToStaticMarkup(createElement(TunerDisplay, { note: null, frequency: null, cents: null }));
  assert.match(idle, /No note detected/);
  assert.match(idle, />Ready</);
  for (const frequency of [null, NaN, Infinity, 0]) {
    const html = renderToStaticMarkup(createElement(TunerDisplay, {
      note: { name: 'A', octave: 4 }, frequency, cents: 0, active: true, listening: true,
    }));
    assert.doesNotMatch(html, /data-in-tune="true"|NaN|Infinity/);
    assert.match(html, />Listening</);
  }
  const tuned = renderToStaticMarkup(createElement(TunerDisplay, {
    note: { name: 'A', octave: 4 }, frequency: 440, cents: 0, active: true, listening: true,
  }));
  assert.match(tuned, />In tune</);
});
test('brand link contains only its supplied logo and label with a safe external target', () => {
  const html = renderToStaticMarkup(createElement(BrandLink, {
    href: 'https://davidportal.dev', label: 'davidportal.dev', logoSrc: '/logo.svg',
  }));
  assert.match(html, /href="https:\/\/davidportal.dev"/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /<img[^>]+alt=""/);
  assert.match(html, /<span>davidportal.dev<\/span>/);
});
