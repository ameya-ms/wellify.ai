import os
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import pytesseract

def load_insurance_documents(folder_path):
    """
    Loads and extracts text from PDFs, organized by insurance type.
    Returns a dictionary: {"medicare": "text...", "applecare": "text...", "health101": "text..."}
    """
    documents = {
        "medicare": "",
        "applecare": "",
        "health101": "",
        "other": ""
    }
    
    if not os.path.exists(folder_path):
        print(f"❌ Data folder not found: {folder_path}")
        return documents
    
    # Walk through folder and subfolders
    pdf_files = []
    for root, dirs, files in os.walk(folder_path):
        for f in files:
            if f.startswith("insurance_") and f.lower().endswith(".pdf"):
                pdf_files.append(os.path.join(root, f))
    
    if not pdf_files:
        print("⚠️ No insurance_*.pdf files found in data folder or subfolders.")
        return documents
    
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
            
            # Categorize based on filename
            filename = os.path.basename(full_path).lower()
            if "medicare" in filename:
                documents["medicare"] = pdf_text
                print(f"   → Categorized as Medicare")
            elif "apple" in filename or "applecare" in filename:
                documents["applecare"] = pdf_text
                print(f"   → Categorized as Apple Care")
            elif "health" in filename:
                documents["health101"] = pdf_text
                print(f"   → Categorized as Health 101")
            else:
                documents["other"] += pdf_text + "\n\n"
                print(f"   → Categorized as Other")
                
        except Exception as e:
            print(f"❌ Error reading {full_path}: {e}")
    
    print(f"\n📊 Document Summary:")
    for doc_type, content in documents.items():
        if content:
            print(f"   {doc_type}: {len(content)} characters")
    
    return documents