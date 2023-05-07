import { useState } from 'react'
import { VStack, Text, Input, Textarea, HStack, Button } from '@chakra-ui/react'

function Generation() {
    const [inputSeq, setInputSeq] = useState('')
    const [generatedSeq, setGeneratedSeq] = useState('')
    const [leng, setLen] = useState('10')
    const [positions, setPositions] = useState('')
    function writeSequence(e: any) {
        setInputSeq(e.target.value)
    }
    function writeLen(e: any) {
        setLen(e.target.value)
    }
    function writePositions(e: any) {
        setPositions(e.target.value)
    }
    const addSeq = (e: any) => {
        const fetchAdd = async() => {
            const response = await fetch("http://localhost:8000/generation?seq=" + inputSeq + "&mode=add&leng=" + leng + "&pos=" + positions, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            const generated = await response.json()
            setGeneratedSeq(generated.generated_seq)        
        }
        fetchAdd()
    }
    const changeSeq = (e: any) => {
        const fetchChange = async() => {
            const response = await fetch("http://localhost:8000/generation?seq=" + inputSeq + "&mode=change&leng=" + leng + "&pos=" + positions, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            const generated = await response.json()
            setGeneratedSeq(generated.generated_seq)        
        }
        fetchChange()
    }
    return(
        <VStack>
            <Text>Генерация консервативных участков в последовательности.</Text>
            <Text>Последовательность:</Text>
            <Input onChange={writeSequence} placeholder="Введите последовательность ДНК..." />
            <Text>Длина (для добавления, 10 по умолчанию):</Text>
            <Input value={leng} onChange={writeLen} />
            <Text>Позиции участков (для изменения, по умолчанию выбираются автоматически):</Text>
            <Input value={positions} onChange={writePositions} />
            <HStack>
                <Button onClick={addSeq}>Добавить</Button>
                <Button onClick={changeSeq}>Изменить</Button>
            </HStack>
            <Text>Сгенерированная последовательность:</Text>
            <Textarea
                value={generatedSeq}
                size='sm'
            />
        </VStack>
    )
}

export default Generation