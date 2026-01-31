#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install -r ml/requirements.txt

echo "Training ML model..."
python ml/train.py

echo "Build complete!"
