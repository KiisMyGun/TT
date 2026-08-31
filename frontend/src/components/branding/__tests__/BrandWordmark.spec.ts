import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BrandWordmark from '../BrandWordmark.vue'

describe('BrandWordmark', () => {
  it('renders super smaller and TT larger for the superTT brand', () => {
    const wrapper = mount(BrandWordmark, { props: { name: 'superTT' } })

    expect(wrapper.attributes('aria-label')).toBe('superTT')
    expect(wrapper.get('.brand-wordmark__super').text()).toBe('super')
    expect(wrapper.get('.brand-wordmark__tt').text()).toBe('TT')
  })

  it('keeps custom site names intact', () => {
    const wrapper = mount(BrandWordmark, { props: { name: 'Custom Gateway' } })

    expect(wrapper.text()).toBe('Custom Gateway')
    expect(wrapper.find('.brand-wordmark__tt').exists()).toBe(false)
  })
})
