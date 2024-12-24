import pdfplumber
import json

"""
    This Python script extracts data from a PDF file containing commission rates for products on
    Trendyol platform, cleans the data, and saves it in a JSON file.
    
    :param value: The `value` parameter in the `clean_percentage` function refers to the input value
    that represents a percentage. This function is designed to remove the percentage sign from the input
    value and convert it to a floating-point number. If the input value is not a valid percentage format
    (e.g., contains non
    
    :return: The code reads data from a PDF file containing commission rates for different categories
    and products on the Trendyol platform. It extracts this data, cleans it, and structures it into a
    JSON format. The cleaned data includes information such as category, product group, commissions for
    different levels and special groups, brand details, and various commission rates.
"""

# PDF dosya yolu
pdf_path = "trendyol.pdf"
output_json_path = "output.json"

# JSON formatı için veri yapısı
commission_data = {"commissionRates": []}

def clean_percentage(value):
    """
    Yüzde işaretini kaldır ve float'a dönüştür.
    Geçersiz değerler için None döner.
    """
    try:
        return float(value.replace("%", "").strip())
    except (ValueError, AttributeError):
        return None

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        table = page.extract_table()
        if table:
            headers = table[0]  # İlk satır başlıklar
            for row in table[2:]:
                try:
                    entry = {
                        "platform": "trendyol",  # Sabit platform adı
                        "category": f"{row[1]} > {row[2]}",  # Kategori > Alt Kategori
                        "productgroup": row[3],  # Ürün Grubu
                        "vade": int(row[4]) if row[4].isdigit() else None,  # Vade (İş Günü)
                        "commission": clean_percentage(row[5]),  # Kategori Komisyon %
                        "level5_commission": clean_percentage(row[6]),  # Seviye 5 Satıcı Komisyon
                        "level4_commission": clean_percentage(row[7]),  # Seviye 4 Satıcı Komisyon
                        "special_group_commission": clean_percentage(row[8]),  # Özelleşmiş Grup Satıcılar Komisyon
                        "women_entrepreneur_commission": clean_percentage(row[9]),  # Kadın Girişimci Komisyon
                        "brand": row[10],  # Marka
                        "brand_category_commission": clean_percentage(row[11]),  # Marka Kategori Komisyon
                        "level5_brand_commission": clean_percentage(row[12]),  # Seviye 5 Marka Komisyon
                        "level4_brand_commission": clean_percentage(row[13]),  # Seviye 4 Marka Komisyon
                    }
                    commission_data["commissionRates"].append(entry)
                except IndexError:
                    # Eksik veya hatalı satırları atla
                    continue

# JSON dosyasına yaz
with open(output_json_path, "w", encoding="utf-8") as json_file:
    json.dump(commission_data, json_file, indent=2, ensure_ascii=False)

print(f"JSON formatında kaydedildi: {output_json_path}")
