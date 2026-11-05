/**
 * Motion rules from docs/roadmap/ux/04 (Prettier owns formatting, so these are the only rules). Cards may lift, tilt
 * and show depth, and pages may hand over to each other, but nothing wobbles, loops or overshoots, and only
 * transform and opacity move.
 */

/** Every animation the site may play. A new one is a design decision: name it here with its reason. */
const KEYFRAMES = [
  'pulse', // the invitation pulse on the next arrow once narration ends, played once
  'bob', // the reader's "more text below" cue, once per page
  'panel-open', // the grown-ups panel on a story cover
  'spin', // the booklet export overlay, a grown-ups tool
  'page-sink', // page transitions: the page being left
  'page-rise', // page transitions: the page arriving
  'page-fade-out', // in-story transitions: crossfade out
  'page-fade-in', // in-story transitions: crossfade in
  'turn-out', // the reader's page turn: the page being left
  'turn-in', // the reader's page turn: the next page
];

/** What a transition may change: motion through transforms and opacity, plus plain colour fades. */
// display and overlay only switch at the end, so a popover can fade out before it goes (allow-discrete).
const MOVES =
  '(transform|translate|scale|rotate|opacity|color|background|background-color|border-color|outline-color|display|overlay)';
const ITEM = `${MOVES}\\b(\\([^)]*\\)|[^,(])*`;

export default {
  overrides: [{ files: ['**/*.astro'], customSyntax: 'postcss-html' }],
  rules: {
    'keyframes-name-pattern': [
      `^(${KEYFRAMES.join('|')})$`,
      { message: name => `@keyframes ${name} is not an allowed animation (stylelint.config.mjs, ux/04)` },
    ],
    'rule-selector-property-disallowed-list': [
      { '/:hover/': ['/^animation/'] },
      { message: 'Hover moves a card; it never plays an animation (ux/04)' },
    ],
    'declaration-property-value-disallowed-list': [
      {
        '/^(transition|animation)/': ['/--ease-settle/'],
        '/^animation(-iteration-count)?$/': ['/\\binfinite\\b/'],
      },
      { message: 'No overshoot and no looping animation (ux/04)' },
    ],
    'declaration-property-value-allowed-list': [
      {
        transition: [new RegExp(`^(none|${ITEM}(,\\s*${ITEM})*)$`)],
        'transition-property': [new RegExp(`^${MOVES}(,\\s*${MOVES})*$`)],
      },
      { message: 'Only transform, opacity and colour may be transitioned (ux/04)' },
    ],
  },
};
