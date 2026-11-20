import { afterEach, describe, expect, it, vi } from "vitest"
import { getDemoReference, placeDemoOrder } from "./demoCheckout"

const artwork = { id: 1, title: "Demo artwork", price: 1500, currency: "KES", image: "/demo.jpg", available: true }
const details = { customerName: " Alex Demo ", customerEmail: "alex@example.com", customerPhone: "0700000000", demoAcknowledged: "on" }
const reference = "AG-12345678-1234-1234-1234-123456789abc"
const response = (status, data) => ({ ok: status < 400, status, json: async () => data })
afterEach(() => vi.unstubAllGlobals())

describe("demo checkout", () => {
    it("saves current item details, quantities, and the correct multi-item total", async () => {
        const second = { ...artwork, id: 2, title: "Second piece", price: 2500 }
        const fetchMock = vi.fn(async (url, options) => {
            if (options?.method === "POST") return response(201, JSON.parse(options.body))
            return url.endsWith("/artworks") ? response(200, [artwork, second]) : response(404, {})
        })
        vi.stubGlobal("fetch", fetchMock)
        const saved = await placeDemoOrder([artwork, second], details, reference)
        expect(saved.totalAmount).toBe(4000)
        expect(saved.items.map(item => item.quantity)).toEqual([1, 1])
        expect(saved.customerName).toBe("Alex Demo")
        expect(saved.paymentStatus).toBe("not-required")
        expect(fetchMock.mock.calls.filter(([, options]) => options?.method === "POST")).toHaveLength(1)
    })

    it("does not post an order for sold, missing or repriced artwork", async () => {
        for (const latest of [[], [{ ...artwork, available: false }], [{ ...artwork, price: 1900 }]]) {
            const fetchMock = vi.fn(async url => url.endsWith("/artworks") ? response(200, latest) : response(404, {}))
            vi.stubGlobal("fetch", fetchMock)
            await expect(placeDemoOrder([artwork], details, reference)).rejects.toThrow()
            expect(fetchMock.mock.calls.some(([, options]) => options?.method === "POST")).toBe(false)
        }
    })

    it("recovers a saved order after a lost POST response without posting it twice", async () => {
        let saved
        const fetchMock = vi.fn(async (url, options) => {
            if (options?.method === "POST") { saved = JSON.parse(options.body); throw new Error("Response lost") }
            if (url.endsWith("/artworks")) return response(200, [artwork])
            return saved ? response(200, saved) : response(404, {})
        })
        vi.stubGlobal("fetch", fetchMock)
        await expect(placeDemoOrder([artwork], details, reference)).rejects.toThrow("cart has been kept")
        expect((await placeDemoOrder([artwork], details, reference)).id).toBe(reference)
        expect(fetchMock.mock.calls.filter(([, options]) => options?.method === "POST")).toHaveLength(1)
    })

    it("reports save failures and malformed catalogue responses", async () => {
        vi.stubGlobal("fetch", vi.fn(async (url, options) => options?.method === "POST" ? response(500, {}) : url.endsWith("/artworks") ? response(200, [artwork]) : response(404, {})))
        await expect(placeDemoOrder([artwork], details, reference)).rejects.toThrow("Could not save")
        vi.stubGlobal("fetch", vi.fn(async url => url.endsWith("/artworks") ? response(200, {}) : response(404, {})))
        await expect(placeDemoOrder([artwork], details, reference)).rejects.toThrow("unexpected artwork data")
    })

    it("validates contact details and acknowledgement before any request", async () => {
        const fetchMock = vi.fn()
        vi.stubGlobal("fetch", fetchMock)
        for (const invalid of [{ ...details, customerName: " " }, { ...details, customerEmail: "invalid" }, { ...details, customerPhone: "abc" }, { ...details, demoAcknowledged: "" }]) {
            await expect(placeDemoOrder([artwork], invalid, reference)).rejects.toThrow()
        }
        await expect(placeDemoOrder([], details, reference)).rejects.toThrow("empty")
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("reuses references for the same cart and changes them for a new selection", () => {
        const memory = new Map()
        vi.stubGlobal("sessionStorage", { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) })
        const first = getDemoReference([artwork])
        expect(getDemoReference([artwork]).id).toBe(first.id)
        expect(getDemoReference([{ ...artwork, id: 2 }], first).id).not.toBe(first.id)
    })
})
