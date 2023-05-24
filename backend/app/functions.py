import os
import pandas as pd
import numpy as np
import torch
from transformers import AutoTokenizer, EsmForSequenceClassification, Trainer, TrainingArguments

# загружаем предобученный токенизер и обученные нами модели 
tokenizer = AutoTokenizer.from_pretrained("facebook/esm2_t6_8M_UR50D")
classificator = EsmForSequenceClassification.from_pretrained("./classificator")
generator = EsmForSequenceClassification.from_pretrained("./generator")
k = 9
id2label = {0: "A", 1: "C", 2: "G", 3: "T"}

def find_conservative(seq):
    indexes = []
    output_str, conserv = "", ""
    cnt = 0
    l, r = -1, -1 # значения левой и правой границ последовательности
    for i in range(len(seq) - k + 1):
        # отправляем участок из k нуклеотидов в классификатор
        label = classificator(**tokenizer(seq[i:i+k], return_tensors="pt")).logits.argmax().item()
        if label == 1:
            # если участок консервативен и он не идёт подряд за другим консервативным участком (l == -1), задаём границы l, r
            # и начало последовательности conserv 
            cnt = 0
            if l == -1:
                l = i
                r = i + k - 1
                conserv = seq[l:r+1]
            # если данный консервативный участок - продолжение последовательности, увеличиваем значение r и прибавляем нуклеотид к conserv
            else:
                r = i + k - 1
                conserv += seq[r]
        else:
            # если найдена неконсервативная последовательность, но она является продолжением консервативной, до правой границы которой
            # цикл пока не дошёл
            if i <= r:
                continue
            cnt += 1
            # если встретились 2 неконсервативные последовательности подряд и граница последней консервативной пройдена, то убираем 
            # из conserv нуклеотид от первой из них и прибавляем к результату последовательность conserv с позицией её левой границы
            if cnt > 1:
                if l != -1:
                    r -= 1
                    conserv = conserv[:-1]
                    indexes.append((l, r))
                    output_str += "{0} {1}\n".format(conserv, l)
                    conserv = ""
                    l, r = -1, -1
                continue
            # если встретилась пока только 1 неконсервативная последовательность и до этого шла консервативная, считаем её продолжением
            # и прибавляем нуклеотид к conserv, увеличиваем правую границу (на случай, если следующий за ней k-мер консервативен) 
            if l != -1:
                r += 1
                conserv += seq[r]
    # проверим, не выпал ли на правый край исходной последовательности консервативный участок, т. к. в таком случае цикл его в ответ не записал
    if l != -1:
        indexes.append((l, r))
        output_str += "{0} {1}\n".format(conserv, l)
    return output_str, indexes

def generate_sequence(seq, mode, leng, pos):
    generated_seq = seq
    if mode == 'add':
        # если задан режим "добавление", проходимся циклом по последовательности до тех пор, пока не сгенерируем leng нуклеотидов
        for i in range(leng):
            nucl_id = generator(**tokenizer(generated_seq[i:i+k-1], return_tensors="pt")).logits.argmax().item()
            generated_seq += id2label[nucl_id]
    else:
        # если задан режим "изменение" и список позиций, то проходимся по нему циклом и генерируем нуклеотиды в этих местах
        if pos:
            for p in pos.split(' '):
                nucl_id = generator(**tokenizer(generated_seq[int(p)-k:int(p)], return_tensors="pt")).logits.argmax().item()
                generated_seq = generated_seq[:int(p)] + id2label[nucl_id] + generated_seq[int(p)+1:]
            return generated_seq
        # если задан режим "изменение" и автоматический подбор позиций, проходимся по последовательности и если классификатор определяет
        # участок как неконсервативный, генерируем в этом месте другой нуклеотид
        for i in range(k, len(seq)):
            if classificator(**tokenizer(generated_seq[i-k:i], return_tensors="pt")).logits.argmax().item() == 0:
                nucl_id = generator(**tokenizer(generated_seq[i-k:i], return_tensors="pt")).logits.argmax().item()
                generated_seq = generated_seq[:i] + id2label[nucl_id] + generated_seq[i+1:]
    return generated_seq