// .stylelintrc.js
module.exports = {
  extends: ['stylelint-config-standard-scss'],
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
  rules: {
    // --- FIXES & Common Adjustments ---
    indentation: 2,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'selector-id-pattern': [
      '^[a-z]+([a-z0-9-_]+[a-z0-9]+)?$',
      {
        message:
          'Expected id selector to be kebab-case or snake_case (e.g. my-id or my_id)',
      },
    ],
    // 'scss/no-global-function-names': null, // Keep this commented unless you want to allow darken/lighten

    // ***** ADD THIS LINE TO DISABLE THE RULE *****
    'media-feature-range-notation': null,
    // *********************************************

    // --- Optional Formatting Preferences ---
    'at-rule-empty-line-before': null,
    'rule-empty-line-before': null,
    'comment-empty-line-before': null,
    'scss/double-slash-comment-empty-line-before': null,

    // ... other rules you might have added ...
  },
};
