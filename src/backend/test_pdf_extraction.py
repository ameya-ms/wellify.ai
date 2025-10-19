from pdf_utils import load_insurance_documents

data_folder = "/Users/swararamesh/development/source/DubHacks '25/wellify.ai/data"
text = load_insurance_documents(data_folder)
print(text[:1000])  # print first 1k chars
