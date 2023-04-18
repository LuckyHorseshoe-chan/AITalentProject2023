# Задание
- Обучить классификатор, определяющий по последовательности ДНК, консервативен данный участок из 9 нуклеотидов или нет  
- Обучить генератор консервативной последовательности  
# Решение
Трансформеры хорошо показали себя в задачах nlp, а huggingface предоставляет удобный интерфейс для их использования и подробную документацию, поэтому для 1 пункта задания были проведены эксперименты со следующими моделями: DistilBert, Bert, Bloom, Bart, Canine и Esm.  В целом результаты не сильно различаются на этих моделях или при изменении параметров, но Esm обучается заметно быстрее остальных, так что предпочтение было отдано ей. Генерацию же в нашем случае можно свести к задаче классификации, где каждый из 4 классов - нуклеотид, следующий за участком длиной 8. Поэтому для 2 пункта задания возьмём ту же модель.  
