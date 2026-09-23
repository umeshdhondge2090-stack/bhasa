import sys
sys.stdout.reconfigure(encoding='utf-8')
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_path = r"c:\Users\yoges\OneDrive\Desktop\bhasa\Hindi_Mundari_MT5"
print("Loading tokenizer from:", model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

print("Loading model...")
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)
model.eval()
print("Model loaded successfully!")

test_texts = [
    "नमस्ते",
    "पेड़ हमें छाया देते हैं।",
    "पानी",
    "फूल",
    "बच्चों, आज हम पेड़ के बारे में सीखेंगे।"
]

for text in test_texts:
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=128)
    translated = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"Input: '{text}' -> Output: '{translated}'")
