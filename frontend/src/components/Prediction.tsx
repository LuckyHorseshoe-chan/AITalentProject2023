import { useState } from 'react'
import { VStack, Text, Input, Textarea, HStack, Button } from '@chakra-ui/react'
import './styles.css';

function Prediction() {
    const [inputState, setInputState] = useState('')
    const [outputState, setOutputState] = useState('')
    const [indexes, setIndexes] = useState([])
    // при изменении пользователем поля ввода (элемента Input), задаём ему введённое значение
    function writeSequence(e: any) {
        setInputState(e.target.value)
    }
    const findConservative = (e: any) => {
        // отправляем запрос в API для поиска консервативных участков во введённой последовательности
        const fetchConservative = async() => {
            const response = await fetch("http://localhost:8000/prediction?seq=" + inputState, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            const conserv = await response.json()
            // выводим найденные последовательности и их позиции в Textarea (в conserv.sites содержится отформатированная строка) 
            setOutputState(conserv.sites)
            // задаём список индексов для дальнейшей работы с ними
            setIndexes(conserv.indexes)        
        }
        fetchConservative()
        // если консервативные участки не найдены, выходим из функции
        if (indexes.length === 0)
            return
        // находим div-элемент с id conservative
        const currentDiv = document.getElementById("conservative")
        // удаляем из него все дочерние элементы, если есть
        while (currentDiv && currentDiv.firstChild) {
            currentDiv.removeChild(currentDiv.firstChild);
        }
        let ind = 0
        let s = ''
        // создаём элемент span
        let newSpan = document.createElement("span")
        // задаём ему стиль для подсветки текста
        newSpan.className = "highlight"
        // создаём текстовый узел
        let newContent = document.createTextNode(s)
        // проходимся циклом по введённой строке
        for(let i=0; i<inputState.length; i++){
            // если текущий индекс строки равен индексу левой границы следующего участка, добавляем текст в div и 
            // создаём элемент span с подсветкой 
            if (ind < indexes.length && i === indexes[ind][0]){
                newContent = document.createTextNode(s)
                if(currentDiv)
                    currentDiv.appendChild(newContent)
                newSpan = document.createElement("span")
                newSpan.className = "highlight"
                s = ''
            } // если текущий индекс строки равен индексу правой границы следующего участка, добавляем span с текстом в div
            else if (ind < indexes.length && i === indexes[ind][1]){
                s = s + inputState[i]
                newContent = document.createTextNode(s)
                newSpan.appendChild(newContent)
                if(currentDiv)
                    currentDiv.appendChild(newSpan)
                ind = ind + 1
                s = ''
                continue
            }
            // добавляем к тексту s следующий символ
            s = s + inputState[i]
        }
        if(currentDiv){
            // если правая граница последнего участка в конце, добавляем span с подсвеченным текстом в div 
            newContent = document.createTextNode(s)
            if (ind < indexes.length && inputState.length-1 === indexes[ind][1]){
                newSpan.appendChild(newContent)
                currentDiv.appendChild(newSpan)
            }
            // иначе просто добавляем в div оставшийся текст
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