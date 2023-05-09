# Задание
- Обучить классификатор, определяющий по последовательности ДНК, консервативен данный участок из 9 нуклеотидов или нет  
- Обучить генератор консервативной последовательности  
# Решение
Трансформеры хорошо показали себя в задачах nlp, а huggingface предоставляет удобный интерфейс для их использования и подробную документацию, поэтому для 1 пункта задания были проведены эксперименты со следующими моделями: DistilBert, Bert, Bloom, Bart, Canine и Esm.  В целом результаты не сильно различаются на этих моделях или при изменении параметров, но Esm обучается заметно быстрее остальных, так что предпочтение было отдано ей. Генерацию же в нашем случае можно свести к задаче классификации, где каждый из 4 классов - нуклеотид, следующий за участком длиной 8. Поэтому для 2 пункта задания возьмём ту же модель.  
# Запуск приложения  
`git clone https://github.com/LuckyHorseshoe-chan/AITalentProject2023.git`  
`cd AITalentProject2023/backend`   
`pip3 install -r requirements.txt`  
`python3 main.py`  
В другой консоли:  
`cd AITalentProject2023/frontend`  
`npm run start`  
Далее заходим на http://localhost:3000/ - страницу с приложением. Можно также зайти на http://localhost:8000/docs, чтобы проверить работу API.  
Примеры работы приложения можно посмотреть в файле Use_Case.pdf  
Последовательности из примеров для ввода:  
ATGGGCCTCACCGTGTCCGCGCTCTTTTCGCGGATCTTCGGGAAGAAGCAGATGCGGATTCTCATGGTTGGCTTGGATGCGGCTGGCAAGACCACAATCCTGTACAAACTGAAGTT  
GCCGTGGCGGTGCGAGAATCCTGGCAAGCAGAAGAAAAAACTTGTGACCTGGTGGGAGA  
GCCGTGGCGGTGCGAGAATC  
ATGGGCCTCACCGTGTCCGC  