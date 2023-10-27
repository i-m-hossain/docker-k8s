import { useEffect, useState } from "react"
import { endpoints } from "./config/endpoints"
const Home = () => {
    const [values, setValues] = useState([])
    const [index, setIndex] = useState("")
    const [seenIndexes, setSeenIndexes] = useState([])
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!index) {
            alert('please specify index')
            return;
        }
        console.log({"endpount": endpoints})
        await fetch(endpoints.addValue, {
            method: 'post',
            headers: {
                "Content-type": "Application/json"
            },
            body: { index }
        })
        setIndex('')
    }
    useEffect(() => {
        getValues()
        getIndexes()
    }, [])
    async function getValues() {
        const result = await fetch(endpoints.fetchValues)
        const data = await result.json()
        setValues(data);
    }
    async function getIndexes() {
        const result = await fetch(endpoints.fetchIndexes)
        const data = await result.json()
        setSeenIndexes(data);
    }
    function renderSeenIndexes() {
        return seenIndexes.map(({ number }) => number).join(', ');
    }

    function renderValues() {
        const entries = [];
        for (let key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>
            );
        }

        return entries;
    }
    return <>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="please input index"
                value={index}
                onChange={e => setIndex(e.target.value)}
            />
            <button type="submit">submit</button>
        </form>

        <div>
            <h2>Indices I have seen</h2>
            <div>
               {renderSeenIndexes()}
            </div>
        </div>
        <div>
            <h2>Calculated values</h2>
            <div>
                {renderValues()}
            </div>
        </div>
    </>
}

export default Home;