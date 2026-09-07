import { describe, expect, it } from 'vitest'
import { authCBitsToArray } from 'App/role/util'

// Smoke test for the vitest + Vite alias wiring introduced with the gulp/
// webpack -> Vite build migration; see client CLAUDE.md.
describe('role/util authCBitsToArray', () => {
	it('sorts auth context bits by position and labels each with its key', () => {
		const bits = {
			DELETE: { position: 3 },
			READ: { position: 0 },
			UPDATE: { position: 1 }
		}

		const result = authCBitsToArray(bits)

		expect(result.map(bit => bit.label)).toEqual(['READ', 'UPDATE', 'DELETE'])
		expect(result.map(bit => bit.position)).toEqual([0, 1, 3])
	})
})
