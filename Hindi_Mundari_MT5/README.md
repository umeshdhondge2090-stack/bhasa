# Hindi-Mundari mT5 Model Directory

This directory contains the tokenizer, configuration files, and weights for the fine-tuned mT5 Hindi-Mundari translation model.

### Files in this directory:
- `config.json`
- `generation_config.json`
- `special_tokens_map.json`
- `spiece.model` (SentencePiece tokenizer)
- `tokenizer_config.json`
- `model.safetensors` *(~1.2 GB - excluded from git due to GitHub's 100MB file limit)*

> **Note:** Ensure `model.safetensors` is placed in this folder before running `server.py` or `test_model.py`.
