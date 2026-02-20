import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from "../../src/rules/no-kintone-internal-selector.js";

const ruleTester = new RuleTester();

ruleTester.run("no-kintone-internal-selector", rule, {
  valid: [
    `element.querySelector('.foo')`,
    `element.querySelectorAll('.foo')`,
    `querySelector('.foo')`,
    `querySelectorAll('.foo')`,
    `$('.foo')`,
    `$(document).on('click', '.foo', handler)`,
    // matches and closest with valid class names
    `element.matches('.foo')`,
    `element.closest('.bar')`,
    // template literals with valid class names
    "element.querySelector(`.foo`)",
    // eslint-disable-next-line no-template-curly-in-string
    "element.querySelector(`.${className}`)",
    // *-gaia pattern should not match as substring (e.g., foo-gaia-bar)
    `element.querySelector('.foo-gaia-bar')`,
    `element.querySelector('.some-gaia-component')`,
  ],
  invalid: [
    // .gaia-argoui-*
    {
      code: `element.querySelector('.gaia-argoui-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `element.querySelector('.foo > .gaia-argoui-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `element.querySelectorAll('.gaia-argoui-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo.gaia-argoui-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `element.getElementsByClassName('gaia-argoui-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo gaia-argoui-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `$('.gaia-argoui-foo')`,
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `$(document).on('click', '.gaia-argoui-foo', handler)`,
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    // .*-gaia
    {
      code: `element.querySelector('.foo-gaia')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      code: `element.querySelector('.foo > .foo-gaia')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo-gaia')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo.foo-gaia')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo-gaia')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo foo-gaia')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      code: `$('.foo-gaia')`,
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      code: `$(document).on('click', '.foo-gaia', handler)`,
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `foo-gaia` },
        },
      ],
    },
    // kintone-*
    {
      code: `element.querySelector('.kintone-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `kintone-foo` },
        },
      ],
    },
    {
      code: `element.querySelector('.foo > .kintone-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `kintone-foo` },
        },
      ],
    },
    {
      code: `element.querySelectorAll('.kintone-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `kintone-foo` },
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo.kintone-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `kintone-foo` },
        },
      ],
    },
    {
      code: `element.getElementsByClassName('kintone-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `kintone-foo` },
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo kintone-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `kintone-foo` },
        },
      ],
    },
    {
      code: `$('.kintone-foo')`,
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `kintone-foo` },
        },
      ],
    },
    {
      code: `$(document).on('click', '.kintone-foo', handler)`,
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `kintone-foo` },
        },
      ],
    },
    // ocean-*
    {
      code: `element.querySelector('.ocean-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `ocean-foo` },
        },
      ],
    },
    {
      code: `element.querySelector('.foo > .ocean-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `ocean-foo` },
        },
      ],
    },
    {
      code: `element.querySelectorAll('.ocean-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `ocean-foo` },
        },
      ],
    },
    {
      code: `element.querySelectorAll('.foo.ocean-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `ocean-foo` },
        },
      ],
    },
    {
      code: `element.getElementsByClassName('ocean-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `ocean-foo` },
        },
      ],
    },
    {
      code: `element.getElementsByClassName('foo ocean-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `ocean-foo` },
        },
      ],
    },
    {
      code: `$('.ocean-foo')`,
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `ocean-foo` },
        },
      ],
    },
    {
      code: `$(document).on('click', '.ocean-foo', handler)`,
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `ocean-foo` },
        },
      ],
    },
    // matches and closest
    {
      code: `element.matches('.gaia-argoui-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `element.closest('.gaia-argoui-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: `element.matches('.foo-gaia')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      code: `element.closest('.ocean-foo')`,
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `ocean-foo` },
        },
      ],
    },
    // template literals
    {
      code: "element.querySelector(`.gaia-argoui-foo`)",
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: "element.querySelector(`.foo-gaia`)",
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `foo-gaia` },
        },
      ],
    },
    {
      // eslint-disable-next-line no-template-curly-in-string
      code: "element.querySelector(`.${prefix}-gaia-argoui-foo`)",
      errors: [
        {
          messageId: "forbiddenClassname",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
    {
      code: "$(`.gaia-argoui-foo`)",
      errors: [
        {
          messageId: "suspiciousClassnameLiteral",
          data: { className: `gaia-argoui-foo` },
        },
      ],
    },
  ],
});
