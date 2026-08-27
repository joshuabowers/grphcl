import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { add } from './mod.ts'


describe( 'add', () => {
    it('is the sum of two real numbers', () => {
        expect(add(1, 2)).toBe(3)
    })

    it('is NaN if given NaN', () => {
        expect(add(NaN, 3)).toBe(NaN)
    })
})