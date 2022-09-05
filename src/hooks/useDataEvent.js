import { useState } from "react";

const useDataEvent = (props = {}) => {
    const [data, setData] = useState(props)

    const setDataEvent = e => {
        !e.target
            ? setData(e)
            : setData({
                ...data,
                [e.target.name]: e.target.value
            })
    }

    const resetData = () => setData(props)

    return [data, setDataEvent, resetData]
}

export default useDataEvent