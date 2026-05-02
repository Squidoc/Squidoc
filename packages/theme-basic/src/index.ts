import { defineTheme } from "@squidoc/core";

export const globalCss = `:root {
  color-scheme: light;
  --squidoc-accent: #4a54df;
  --squidoc-border: #d8dee8;
  --squidoc-text: #172033;
  --squidoc-muted: #5f6f89;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  min-height: 100vh;
  margin: 0;
  color: var(--squidoc-text);
  background: #ffffff;
}

a {
  color: var(--squidoc-accent);
}

.sq-icon-sprite {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.sq-icon {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.sq-shell {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr) minmax(180px, 240px);
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: calc(100vh - 60px);
}

.sq-page-shell {
  display: flex;
  min-height: calc(100vh - 60px);
  flex-direction: column;
}

.sq-page-content {
  flex: 1;
}

.sq-home {
  display: grid;
  min-height: min(720px, calc(100vh - 60px));
  align-items: center;
  border-bottom: 1px solid var(--squidoc-border);
  padding: 72px 24px;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
}

.sq-home__inner {
  width: min(920px, 100%);
  margin: 0 auto;
}

.sq-home__eyebrow {
  margin: 0 0 14px;
  color: var(--squidoc-accent);
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
}

.sq-home h1 {
  margin: 0;
  color: var(--squidoc-text);
  font-size: clamp(52px, 9vw, 96px);
  line-height: 0.95;
}

.sq-home__lead {
  max-width: 680px;
  margin: 24px 0 0;
  color: var(--squidoc-muted);
  font-size: 22px;
  line-height: 1.5;
}

.sq-home__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 32px 0 0;
}

.sq-home__primary,
.sq-home__secondary {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  border-radius: 8px;
  padding: 0 16px;
  font-weight: 800;
  text-decoration: none;
}

.sq-home__primary {
  color: #ffffff;
  background: var(--squidoc-accent);
}

.sq-home__secondary {
  border: 1px solid var(--squidoc-border);
  color: var(--squidoc-text);
  background: #ffffff;
}

.sq-home__install {
  max-width: 520px;
  margin: 32px 0 0;
  border: 1px solid #233048;
  border-radius: 8px;
  padding: 18px;
  overflow: auto;
  color: #dce7ff;
  background: #101827;
  font-size: 14px;
  line-height: 1.6;
}

.sq-home-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  width: min(1120px, calc(100% - 48px));
  margin: 56px auto;
  border: 1px solid var(--squidoc-border);
  background: var(--squidoc-border);
}

.sq-home-grid article {
  padding: 28px;
  background: #ffffff;
}

.sq-home-grid h2 {
  margin: 0 0 10px;
  font-size: 20px;
}

.sq-home-grid p {
  margin: 0;
  color: var(--squidoc-muted);
  line-height: 1.6;
}

.sq-topbar {
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 60px;
  border-bottom: 1px solid var(--squidoc-border);
  padding: 0 24px;
  background: rgb(255 255 255 / 94%);
  backdrop-filter: blur(12px);
}

.sq-topbar__brand {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  flex: 0 0 auto;
  color: var(--squidoc-text);
  font-weight: 800;
  text-decoration: none;
}

.sq-topbar__logo {
  display: block;
  width: auto;
  height: 44px;
}

.sq-topbar__brand-text {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.sq-topbar__nav {
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  gap: 16px;
}

.sq-topbar__link {
  color: var(--squidoc-muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.sq-topbar__link:hover {
  color: var(--squidoc-text);
}

.sq-topbar > .sq-locale-selector {
  position: relative;
  display: block;
  flex: 0 0 auto;
  margin: 0;
}

.sq-topbar > .sq-locale-selector .sq-locale-selector__label {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.sq-topbar > .sq-locale-selector .sq-locale-selector__select {
  width: auto;
  min-width: 132px;
  min-height: 38px;
  border-radius: 999px;
  padding: 7px 34px 7px 34px;
  background:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%234a54df' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21M12 3c-2.2 2.5-3.3 5.5-3.3 9s1.1 6.5 3.3 9'/%3E%3C/g%3E%3C/svg%3E")
      left 11px center / 16px 16px no-repeat,
    url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m7 10 5 5 5-5' fill='none' stroke='%235f6f89' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8'/%3E%3C/svg%3E")
      right 11px center / 16px 16px no-repeat,
    #ffffff;
  font-weight: 700;
}

.sq-topbar > .sq-locale-selector .sq-locale-selector__select:focus {
  border-color: var(--squidoc-accent);
  outline: 2px solid color-mix(in srgb, var(--squidoc-accent), transparent 78%);
  outline-offset: 1px;
}

.sq-sidebar-control {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  opacity: 0;
  pointer-events: none;
}

.sq-sidebar-toggle {
  display: none;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--squidoc-border);
  border-radius: 8px;
  padding: 7px 10px;
  color: var(--squidoc-text);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.sq-sidebar {
  position: sticky;
  top: 60px;
  align-self: start;
  height: calc(100vh - 60px);
  box-sizing: border-box;
  overflow: auto;
  border-right: 1px solid var(--squidoc-border);
  padding: 24px;
}

.sq-brand {
  margin: 0 0 24px;
  font-size: 18px;
}

.sq-nav {
  font-size: 14px;
}

.sq-locale-selector {
  display: grid;
  gap: 7px;
  margin: 0 0 18px;
}

.sq-locale-selector__label {
  color: var(--squidoc-muted);
  font-size: 12px;
  font-weight: 700;
}

.sq-locale-selector__select {
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  min-height: 36px;
  border: 1px solid var(--squidoc-border);
  border-radius: 8px;
  padding: 7px 34px 7px 9px;
  color: var(--squidoc-text);
  background:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m7 10 5 5 5-5' fill='none' stroke='%235f6f89' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8'/%3E%3C/svg%3E")
      right 9px center / 16px 16px no-repeat,
    #ffffff;
  font: inherit;
  font-size: 14px;
}

.sq-version-selector {
  display: grid;
  gap: 8px;
  margin: 0 0 22px;
  border: 1px solid color-mix(in srgb, var(--squidoc-accent), var(--squidoc-border) 72%);
  border-radius: 8px;
  padding: 10px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--squidoc-accent), transparent 94%), transparent),
    #ffffff;
}

.sq-version-selector__label {
  color: var(--squidoc-muted);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.sq-version-selector__select {
  appearance: none;
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;
  border: 1px solid var(--squidoc-border);
  border-radius: 8px;
  padding: 8px 34px 8px 34px;
  color: var(--squidoc-text);
  background:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%234a54df' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8'%3E%3Cpath d='M8 4h8l2 3v13l-6-3-6 3V7l2-3Z'/%3E%3Cpath d='M8 4v4h8V4'/%3E%3C/g%3E%3C/svg%3E")
      left 10px center / 16px 16px no-repeat,
    url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m7 10 5 5 5-5' fill='none' stroke='%235f6f89' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.8'/%3E%3C/svg%3E")
      right 10px center / 16px 16px no-repeat,
    #ffffff;
  font: inherit;
  font-size: 14px;
  font-weight: 750;
}

.sq-version-selector__select:focus {
  border-color: var(--squidoc-accent);
  outline: 2px solid color-mix(in srgb, var(--squidoc-accent), transparent 78%);
  outline-offset: 1px;
}

.sq-nav__list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sq-nav__list .sq-nav__list {
  margin: 8px 0 2px 14px;
  padding-left: 12px;
}

.sq-nav__item {
  min-width: 0;
}

.sq-nav a,
.sq-nav span {
  display: inline-flex;
  min-width: 0;
  color: var(--squidoc-muted);
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.sq-nav a {
  color: var(--squidoc-muted);
  text-decoration: none;
}

.sq-nav a[aria-current="page"] {
  color: var(--squidoc-text);
  font-weight: 700;
}

.sq-nav details {
  display: grid;
}

.sq-nav summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--squidoc-muted);
  cursor: pointer;
  list-style: none;
}

.sq-nav summary::-webkit-details-marker {
  display: none;
}

.sq-nav summary::after {
  content: none;
}

.sq-nav summary a {
  color: inherit;
}

.sq-nav summary a[aria-current="page"] {
  color: var(--squidoc-text);
  font-weight: 700;
}

.sq-nav__chevron {
  flex: 0 0 auto;
  width: 15px;
  height: 15px;
  color: var(--squidoc-muted);
  transition: transform 140ms ease;
}

.sq-nav details[open] > summary .sq-nav__chevron {
  transform: rotate(90deg);
}

.sq-search {
  position: relative;
  flex: 1 1 320px;
  max-width: 440px;
  margin: 0 auto;
}

.sq-search__label {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.sq-search__input {
  box-sizing: border-box;
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--squidoc-border);
  border-radius: 8px;
  padding: 8px 10px 8px 34px;
  color: var(--squidoc-text);
  background: #ffffff;
  font: inherit;
}

.sq-search__icon {
  position: absolute;
  top: 50%;
  left: 11px;
  width: 16px;
  height: 16px;
  color: var(--squidoc-muted);
  pointer-events: none;
  transform: translateY(-50%);
}

.sq-search__input:focus {
  border-color: var(--squidoc-accent);
  outline: 2px solid color-mix(in srgb, var(--squidoc-accent), transparent 78%);
  outline-offset: 1px;
}

.sq-search__results {
  display: none;
  position: absolute;
  z-index: 5;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  max-height: min(420px, 70vh);
  overflow: auto;
  border: 1px solid var(--squidoc-border);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgb(23 32 51 / 12%);
}

.sq-search[data-has-query] .sq-search__results {
  display: grid;
}

.sq-search__result {
  display: grid;
  gap: 3px;
  padding: 10px;
  color: var(--squidoc-text);
  text-decoration: none;
}

.sq-search__result + .sq-search__result {
  border-top: 1px solid var(--squidoc-border);
}

.sq-search__result:hover,
.sq-search__result:focus {
  background: #f6f8fb;
  outline: none;
}

.sq-search__result-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
}

.sq-search__result-version {
  border: 1px solid var(--squidoc-border);
  border-radius: 999px;
  padding: 2px 7px;
  color: var(--squidoc-muted);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.sq-search__result-description {
  color: var(--squidoc-muted);
  font-size: 12px;
  line-height: 1.45;
}

.sq-search__empty {
  margin: 0;
  padding: 10px;
  color: var(--squidoc-muted);
  font-size: 13px;
}

.sq-content {
  box-sizing: border-box;
  flex: 1 0 auto;
  width: 100%;
  max-width: 820px;
  padding: 48px;
}

.sq-page {
  display: block;
  min-width: 0;
}

.sq-article-tree {
  position: sticky;
  top: 60px;
  align-self: start;
  max-height: calc(100vh - 60px);
  overflow: auto;
  padding: 48px 24px 24px 0;
}

.sq-article-tree__title {
  margin: 0 0 12px;
  color: var(--squidoc-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.sq-article-tree__list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
}

.sq-article-tree__link {
  color: var(--squidoc-muted);
  line-height: 1.45;
  text-decoration: none;
}

.sq-article-tree__link:hover,
.sq-article-tree__link[data-active] {
  color: var(--squidoc-text);
}

.sq-article-tree__link[data-depth="3"] {
  padding-left: 12px;
}

.sq-content h1 {
  font-size: 42px;
  line-height: 1.1;
}

.sq-content h1,
.sq-content h2,
.sq-content h3,
.sq-content h4,
.sq-content h5,
.sq-content h6 {
  scroll-margin-top: 84px;
}

.sq-heading-anchor {
  margin-left: 0.35em;
  color: var(--squidoc-muted);
  font-size: 0.78em;
  font-weight: 800;
  opacity: 0;
  text-decoration: none;
  transition:
    color 140ms ease,
    opacity 140ms ease;
}

.sq-heading-anchor:hover,
.sq-heading-anchor:focus {
  color: var(--squidoc-accent);
  outline: none;
}

.sq-heading-anchor::before {
  content: "#";
}

.sq-content :is(h1, h2, h3, h4, h5, h6):hover .sq-heading-anchor,
.sq-content :is(h1, h2, h3, h4, h5, h6):focus-within .sq-heading-anchor {
  opacity: 1;
}

.sq-content p,
.sq-content li {
  line-height: 1.7;
}

.sq-content table {
  display: block;
  width: max-content;
  min-width: min(640px, 100%);
  max-width: 100%;
  margin: 24px 0;
  overflow-x: auto;
  border-spacing: 0;
}

.sq-content th,
.sq-content td {
  border-bottom: 1px solid var(--squidoc-border);
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
}

.sq-content th {
  color: var(--squidoc-text);
  font-size: 14px;
}

.sq-content td {
  color: var(--squidoc-muted);
  font-size: 14px;
  line-height: 1.55;
}

.sq-content th:first-child,
.sq-content td:first-child {
  padding-left: 0;
}

.sq-content th:last-child,
.sq-content td:last-child {
  padding-right: 0;
}

.sq-content :not(pre) > code {
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 0.12em 0.32em;
  color: #334155;
  background: #f8fafc;
  font-size: 0.92em;
}

.sq-content pre {
  box-sizing: border-box;
  max-width: 100%;
  margin: 24px 0;
  border: 1px solid #d8dee8;
  border-radius: 8px;
  padding: 18px 20px;
  background: #f8fafc !important;
  overflow-x: auto;
  line-height: 1.65;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 72%);
}

.sq-codeblock {
  position: relative;
  margin: 24px 0;
}

.sq-codeblock pre {
  margin: 0;
}

.sq-codeblock__copy {
  position: absolute;
  z-index: 1;
  top: -14px;
  right: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 5px 9px;
  color: #475569;
  background: rgb(255 255 255 / 86%);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 140ms ease,
    border-color 140ms ease,
    color 140ms ease;
}

.sq-codeblock:hover .sq-codeblock__copy,
.sq-codeblock:focus-within .sq-codeblock__copy {
  opacity: 1;
}

.sq-codeblock__copy:hover,
.sq-codeblock__copy:focus {
  border-color: var(--squidoc-accent);
  color: var(--squidoc-text);
  outline: none;
}

.sq-codeblock__copy[data-state="copied"] {
  border-color: #16a34a;
  color: #166534;
}

.sq-codeblock__copy[data-state="copying"] {
  border-color: var(--squidoc-accent);
  color: var(--squidoc-accent);
}

.sq-codeblock__copy[data-state="failed"] {
  border-color: #dc2626;
  color: #991b1b;
}

.sq-content pre code {
  display: block;
  min-width: max-content;
  font-size: 13px;
  font-family:
    "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

.sq-content pre code span {
  background: transparent !important;
}

.sq-footer {
  display: flex;
  grid-column: 2 / -1;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid var(--squidoc-border);
  padding: 24px 32px;
  color: var(--squidoc-muted);
  font-size: 14px;
}

.sq-footer__text {
  margin: 0;
}

.sq-footer__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 14px;
}

.sq-footer__link {
  color: var(--squidoc-muted);
  font-weight: 600;
  text-decoration: none;
}

.sq-footer__link:hover {
  color: var(--squidoc-text);
}

@media (max-width: 900px) {
  body {
    overflow: auto;
  }

  .sq-topbar {
    flex-wrap: wrap;
    min-height: 64px;
    gap: 10px;
    padding: 10px 16px;
  }

  .sq-topbar__nav {
    display: none;
    order: 4;
    flex-basis: 100%;
    flex-direction: column;
    gap: 10px;
    border-top: 1px solid var(--squidoc-border);
    padding-top: 12px;
  }

  .sq-search {
    display: none;
    order: 3;
    flex-basis: 100%;
    max-width: none;
  }

  .sq-sidebar-control:checked + .sq-topbar .sq-search {
    display: block;
  }

  .sq-sidebar-control:checked + .sq-topbar .sq-topbar__nav {
    display: flex;
  }

  .sq-sidebar-toggle {
    display: inline-flex;
    order: 2;
    margin-left: auto;
  }

  .sq-topbar > .sq-locale-selector {
    order: 1;
  }

  .sq-topbar > .sq-locale-selector .sq-locale-selector__select {
    min-width: 118px;
  }

  @media (max-width: 370px) {
    .sq-topbar > .sq-locale-selector .sq-locale-selector__select {
      width: 44px;
      min-width: 44px;
      padding-right: 0;
      color: transparent;
    }
  }

  .sq-shell {
    display: block;
    min-height: 0;
  }

  .sq-sidebar {
    display: none;
    position: static;
    height: auto;
    max-height: calc(100vh - 120px);
    border-right: 0;
    border-bottom: 1px solid var(--squidoc-border);
    padding: 18px;
    background: #ffffff;
  }

  .sq-sidebar-control:checked ~ .sq-shell .sq-sidebar {
    display: block;
  }

  .sq-content {
    padding: 28px;
  }

  .sq-content table,
  .sq-content thead,
  .sq-content tbody,
  .sq-content tr,
  .sq-content th,
  .sq-content td {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .sq-content table {
    min-width: 0;
    overflow: visible;
  }

  .sq-content thead {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .sq-content tr {
    margin: 12px 0;
    border: 1px solid var(--squidoc-border);
    border-radius: 8px;
    padding: 10px 12px;
  }

  .sq-content td {
    display: block;
    border-bottom: 0;
    padding: 7px 0;
  }

  .sq-content td::before {
    display: block;
    margin-bottom: 5px;
    color: var(--squidoc-text);
    font-weight: 800;
  }

  .sq-content td:nth-child(1)::before {
    content: "Option";
  }

  .sq-content td:nth-child(2)::before {
    content: "Type";
  }

  .sq-content td:nth-child(3)::before {
    content: "Default";
  }

  .sq-content td:nth-child(4)::before {
    content: "Description";
  }

  .sq-home {
    min-height: auto;
    padding: 48px 20px;
  }

  .sq-home h1 {
    font-size: 56px;
  }

  .sq-home__lead {
    font-size: 18px;
  }

  .sq-home-grid {
    grid-template-columns: 1fr;
    width: calc(100% - 32px);
    margin: 32px auto;
  }

  .sq-page {
    overflow: visible;
  }

  .sq-article-tree {
    display: none;
  }

  .sq-footer {
    display: grid;
    grid-column: auto;
    justify-content: center;
    justify-items: center;
    align-items: center;
    gap: 12px;
    text-align: center;
    padding: 22px 28px;
  }

  .sq-footer__nav {
    justify-content: center;
  }

  .sq-codeblock__copy {
    opacity: 1;
  }
}
`;

export default defineTheme({
  name: "@squidoc/theme-basic",
  layouts: {
    docs: "./layouts/Docs.astro",
    page: "./layouts/Page.astro",
    root: "./layouts/Root.astro",
  },
  renderer: {
    globalCss,
    classes: {
      brand: "sq-brand",
      content: "sq-content",
      nav: "sq-nav",
      shell: "sq-shell",
      sidebar: "sq-sidebar",
    },
  },
  styles: ["./styles/theme.css"],
  slots: {
    footer: "./components/Footer.astro",
    header: "./components/Header.astro",
    sidebar: "./components/Sidebar.astro",
  },
});
