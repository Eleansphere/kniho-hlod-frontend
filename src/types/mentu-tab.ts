import type { Component } from 'vue';

export interface MenuTab {
  label: string;
  icon: string;
  content: Component | null;
  props: Record<string, string | null>;
  value: number;
  roles: Array<string>;
}
