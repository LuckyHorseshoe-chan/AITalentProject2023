import os
import pandas as pd
import numpy as np
import torch
from transformers import AutoTokenizer, EsmForSequenceClassification, Trainer, TrainingArguments

tokenizer = AutoTokenizer.from_pretrained("facebook/esm2_t6_8M_UR50D")
classificator = EsmForSequenceClassification.from_pretrained("./classificator")
generator = EsmForSequenceClassification.from_pretrained("./generator")
k = 9
id2label = {0: "A", 1: "C", 2: "G", 3: "T"}

def find_conservative(seq):
    indexes = []
    output_str, conserv = "", ""
    cnt = 0
    l, r = -1, -1
    for i in range(len(seq) - k + 1):
        label = classificator(**tokenizer(seq[i:i+k], return_tensors="pt")).logits.argmax().item()
        if label == 1:
            cnt = 0
            if l == -1:
                l = i
                r = i + k - 1
                conserv = seq[l:r+1]
            else:
                r = i + k - 1
                conserv += seq[r]
        else:
            if i <= r:
                continue
            cnt += 1
            if cnt > 1:
                if l != -1:
                    r -= 1
                    conserv = conserv[:-1]
                    indexes.append((l, r))
                    output_str += "{0} {1}\n".format(conserv, l)
                    conserv = ""
                    l, r = -1, -1
                continue
            if l != -1:
                r += 1
                conserv += seq[r]
    if l != -1:
        indexes.append((l, r))
        output_str += "{0} {1}\n".format(conserv, l)
    return output_str, indexes

def generate_sequence(seq, mode, leng, pos):
    generated_seq = seq
    if mode == 'add':
        for i in range(leng):
            nucl_id = generator(**tokenizer(generated_seq[i:i+k-1], return_tensors="pt")).logits.argmax().item()
            generated_seq += id2label[nucl_id]
    else:
        if pos:
            for p in pos.split(' '):
                nucl_id = generator(**tokenizer(generated_seq[int(p)-k:int(p)], return_tensors="pt")).logits.argmax().item()
                generated_seq = generated_seq[:int(p)] + id2label[nucl_id] + generated_seq[int(p)+1:]
            return generated_seq
        for i in range(k, len(seq)):
            if classificator(**tokenizer(generated_seq[i-k:i], return_tensors="pt")).logits.argmax().item() == 0:
                nucl_id = generator(**tokenizer(generated_seq[i-k:i], return_tensors="pt")).logits.argmax().item()
                generated_seq = generated_seq[:i] + id2label[nucl_id] + generated_seq[i+1:]
    return generated_seq