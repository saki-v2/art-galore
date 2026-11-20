import { useEffect, useState } from "react"

export default function useApiData(urls) {
    const key = JSON.stringify(urls)
    const [attempt, setAttempt] = useState(0)
    const [result, setResult] = useState({ key, data: null, loading: true, error: "" })

    useEffect(() => {
        let active = true
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)
        const endpoints = JSON.parse(key)
        const requests = Array.isArray(endpoints) ? endpoints : [endpoints]

        Promise.all(requests.map(async (url) => {
            const response = await fetch(url, { signal: controller.signal })
            if (!response.ok) throw new Error("Request failed")
            const data = await response.json()
            if (!Array.isArray(data)) throw new Error("Unexpected response")
            return data
        }))
            .then((data) => {
                if (active) setResult({ key, data: Array.isArray(endpoints) ? data : data[0], loading: false, error: "" })
            })
            .catch(() => {
                if (active) setResult({ key, data: null, loading: false, error: "Could not load this section. Check your connection or make sure the data server is running, then try again." })
            })
            .finally(() => clearTimeout(timeout))

        return () => {
            active = false
            clearTimeout(timeout)
            controller.abort()
        }
    }, [key, attempt])

    const retry = () => {
        setResult({ key, data: null, loading: true, error: "" })
        setAttempt((value) => value + 1)
    }
    const setData = (update) => setResult((previous) => ({
        ...previous,
        data: typeof update === "function" ? update(previous.data) : update,
    }))

    return { ...(result.key === key ? result : { data: null, loading: true, error: "" }), retry, setData }
}
