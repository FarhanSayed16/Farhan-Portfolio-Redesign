import fitz  # PyMuPDF
import os

pdfs = [
    {"file": "Coursera HQTH8TDJ2XYN.pdf", "dest": "cert_20.png"},
    {"file": "Coursera JP32TL3HQXWL.pdf", "dest": "cert_22.png"}
]

base_dir = os.path.dirname(os.path.abspath(__file__))

for item in pdfs:
    pdf_path = os.path.join(base_dir, "CERTIFICATES", item["file"])
    dest_path = os.path.join(base_dir, "public", "images", "certifications", item["dest"])
    
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        continue
        
    print(f"Processing: {item['file']}")
    try:
        doc = fitz.open(pdf_path)
        page = doc.load_page(0)  # first page
        pix = page.get_pixmap(dpi=200)
        pix.save(dest_path)
        print(f"Saved to: {item['dest']}")
    except Exception as e:
        print(f"Error processing {item['file']}: {e}")
