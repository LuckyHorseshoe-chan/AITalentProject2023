import { useState } from 'react'
import { VStack, Text, Input, Textarea, HStack, Button } from '@chakra-ui/react'
import './styles.css';

function Prediction() {
    const [inputState, setInputState] = useState('')
    const [outputState, setOutputState] = useState('')
    const [indexes, setIndexes] = useState([])
    function writeSequence(e: any) {
        setInputState(e.target.value)
    }
    const findConservative = (e: any) => {
        const fetchConservative = async() => {
            const response = await fetch("http://localhost:8000/prediction?seq=" + inputState, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            const conserv = await response.json()
            setOutputState(conserv.sites)
            setIndexes(conserv.indexes)        
        }
        fetchConservative()
        if (indexes.length === 0)
            return
        const currentDiv = document.getElementById("conservative")
        while (currentDiv && currentDiv.firstChild) {
            currentDiv.removeChild(currentDiv.firstChild);
        }
        let ind = 0
        let s = ''
        let newSpan = document.createElement("span")
        newSpan.className = "highlight"
        let newContent = document.createTextNode(s)
        for(let i=0; i<inputState.length; i++){
            if (ind < indexes.length && i === indexes[ind][0]){
                newContent = document.createTextNode(s)
                if(currentDiv)
                    currentDiv.appendChild(newContent)
                newSpan = document.createElement("span")
                newSpan.className = "highlight"
                s = ''
            } else if (ind < indexes.length && i === indexes[ind][1]){
                s = s + inputState[i]
                newContent = document.createTextNode(s)
                newSpan.appendChild(newContent)
                if(currentDiv)
                    currentDiv.appendChild(newSpan)
                ind = ind + 1
                s = ''
                continue
            }
            s = s + inputState[i]
        }
        if(currentDiv){
            newContent = document.createTextNode(s)
            if (ind < indexes.length && inputState.length-1 === indexes[ind][1]){
                newSpan.appendChild(newContent)
                currentDiv.appendChild(newSpan)
            }
            else{
                currentDiv.appendChild(newContent)
            }
        }
      }
    return(
        <VStack>
            <Text>Предсказание консервативных участков в последовательности ДНК</Text>
            <HStack>
                <Input width='1300px' onChange={writeSequence} placeholder="Введите последовательность ДНК..." />
                <Button onClick={findConservative}>Найти</Button>
            </HStack>
            <Text>Найденные участки:</Text>
            <div id="conservative"></div>
            <Textarea
                value={outputState}
                size='sm'
            />
        </VStack>
    )
}

export default Prediction