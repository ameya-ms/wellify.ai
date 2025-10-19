import os
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import pytesseract

def load_insurance_documents(folder_path):
    """
    Loads and extracts text from PDFs in the given folder and its subfolders
    that start with 'insurance_'.
    Returns combined text from all matched PDFs.
    """
    text_data = []

    if not os.path.exists(folder_path):
        print(f"❌ Data folder not found: {folder_path}")
        return ""

    # Walk through folder and subfolders
    pdf_files = []
    for root, dirs, files in os.walk(folder_path):
        for f in files:
            if f.startswith("insurance_") and f.lower().endswith(".pdf"):
                pdf_files.append(os.path.join(root, f))

    if not pdf_files:
        print("⚠️ No insurance_*.pdf files found in data folder or subfolders.")
        return ""

    for full_path in pdf_files:
        try:
            # Try extracting text with PyPDF2 first
            reader = PdfReader(full_path)
            pdf_text = ""
            for page in reader.pages:
                pdf_text += page.extract_text() or ""

            # If PyPDF2 fails, fallback to OCR
            if not pdf_text.strip():
                print(f"⚠️ No text found in {full_path}, using OCR...")
                images = convert_from_path(full_path)
                for img in images:
                    pdf_text += pytesseract.image_to_string(img)

            print(f"✅ Extracted {len(pdf_text)} chars from {full_path}")
            text_data.append(pdf_text)

        except Exception as e:
            print(f"❌ Error reading {full_path}: {e}")

    combined = "\n\n".join(text_data)
    print(f"📄 Total combined text length: {len(combined)}")
    return combined
