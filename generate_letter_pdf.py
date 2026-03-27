from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Register Polish font ───────────────────────────────────────────────────────
# Try to register Arial (Windows) or use fallback
try:
    pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
    FONT_NAME = 'Arial'
except:
    try:
        # Try system Arial on different paths
        import sys
        if sys.platform == 'win32':
            pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
        else:
            pdfmetrics.registerFont(TTFont('Arial', '/System/Library/Fonts/Arial.ttf'))
        FONT_NAME = 'Arial'
    except:
        # Fallback to default (will show squares for Polish chars)
        FONT_NAME = 'Helvetica'

# ── Palette ───────────────────────────────────────────────────────────────────
WHITE    = HexColor("#FFFFFF")
BLACK    = HexColor("#000000")
LGRAY    = HexColor("#333333")
MGRAY    = HexColor("#555555")
DGRAY    = HexColor("#777777")

W, H = 210*mm, 297*mm   # A4 portrait
MARGIN = 25*mm
BOTTOM_MARGIN = 30*mm

OUT = "Letter_Magdalena_Dynkiewicz_2026-03-26.pdf"

# ── Helpers ───────────────────────────────────────────────────────────────────

def text(c, s, x, y, size=11, color=BLACK, align="left"):
    c.setFillColor(color)
    c.setFont(FONT_NAME, size)
    if align == "center":
        c.drawCentredString(x, y, s)
    elif align == "right":
        c.drawRightString(x, y, s)
    else:
        c.drawString(x, y, s)

def wrap_text(c, s, x, y, max_w, size=11, color=BLACK, line_h=None):
    """Word wrap with proper line spacing."""
    if line_h is None:
        line_h = size * 1.5
    c.setFont(FONT_NAME, size)
    c.setFillColor(color)
    
    words = s.split()
    line = ""
    lines = []
    
    for word in words:
        test = (line + " " + word).strip()
        if c.stringWidth(test, FONT_NAME, size) <= max_w:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    
    # Draw lines
    cy = y
    for line in lines:
        c.drawString(x, cy, line)
        cy -= line_h
    
    return cy - line_h  # return Y after last line

def new_page(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def letter_content(c):
    # Header: location and date
    text(c, "Lizbona, 26 marca 2026 r.", W - MARGIN, H - MARGIN, 
         size=9, color=MGRAY, align="right")
    
    # Recipient
    y = H - MARGIN - 20*mm
    text(c, "Szanowni Państwo,", MARGIN, y, size=10, color=BLACK)
    y -= 8*mm
    
    # Body paragraphs
    paragraphs = [
        "Nazywam się Magdalena Dynkiewicz. Piszę do Państwa ten list, ponieważ sytuacja, w której postawił nas Państwa syn, Mateusz, osiągnęła punkt krytyczny. Mogą mnie Państwo kojarzyć poprzez mojego męża, Konrada Dynkiewicza, który przez wiele lat darzył Mateusza ogromnym zaufaniem, zatrudniając go i blisko z nim współpracując.",
        
        "Zapewne wiedzą Państwo, że w 2024 roku przeprowadziliśmy się do Portugalii. Mateusz zamieszkał wtedy z nami, zajmując pokój gościnny w naszym domu. Traktowaliśmy go jak członka rodziny. Niestety, to zaufanie zostało brutalnie wykorzystane.",
        
        "W lutym 2025 roku pożyczyłam Mateuszowi kwotę 225 000 EUR (ok. 970 000 zł). Formalnie środki te trafiły do nowej spółki Mateusza, którą miał rozwijać wspólnie z moim mężem. Pieniądze te miały dla nas szczególne znaczenie – pochodziły ze sprzedaży mieszkania Konrada, o które walczyliśmy latami w sądzie w związku z kredytem we frankach. Wygrana sprawa i sprzedaż nieruchomości w 2023 roku miały być dla nas nowym otwarciem i zabezpieczeniem przyszłości.",
        
        "Przez wiele miesięcy Mateusz systematycznie nas okłamywał. Twierdził, że pieniądze są zablokowane na koncie, że bank prowadzi procedury wyjaśniające i pyta o źródło pochodzenia środków. Wymyślał coraz to nowsze historie, byle tylko odsunąć w czasie prawdę. Dopiero pod koniec sierpnia 2025 roku przyznał mojemu mężowi, że już w kwietniu przelał te pieniądze na swoje prywatne konto i – jak twierdzi – stracił je.",
        
        "Mimo tego, co zrobił, daliśmy mu szansę. Mateusz wyjechał do Polski, obiecując sprzedaż mieszkania i samochodu, by zacząć oddawać to, co de facto ukradł. Niestety, scenariusz się powtórzył. Nie tylko nie oddał ani złotówki, ale przestał nawet opłacać czynsz za swój pokój w Portugalii. Aby uniknąć eksmisji, musieliśmy z własnych środków pokrywać jego zaległości za czynsz i media, których nie regulował od wielu miesięcy.",
        
        "Pod koniec grudnia Mateusz potwierdził, że finalizuje sprzedaż mieszkania tacie i w ciągu kilku dni odda nam pierwsze 400 tys. złotych. Ostatni kontakt z jego strony miał miejsce 15 stycznia 2026 r. Od tego dnia Mateusz milczy. Gosia i Dominik, z którymi również mieliśmy kontakt, także go zerwali.",
        
        "Piszę do Państwa nie dlatego, że wierzę w nagłe odzyskanie tych pieniędzy, ale z poczucia obowiązku poinformowania Państwa o sytuacji Państwa syna. W najbliższych dniach składam oficjalne zawiadomienie do prokuratury. Proszę mieć świadomość konsekwencji: przy takiej kwocie jest to przestępstwo ścigane z urzędu. Oznacza to, że Mateusz będzie poszukiwany listem gończym, również poza granicami kraju, a sprawa ta będzie rzutować na całe jego życie przez najbliższe 15–20 lat.",
        
        "Jeśli mają Państwo jakąkolwiek wiedzę o miejscu pobytu Mateusza lub chcą Państwo podjąć ostatnią próbę polubownego rozwiązania tej sprawy, zanim machina prawna ruszy, proszę o kontakt."
    ]
    
    for para in paragraphs:
        y = wrap_text(c, para, MARGIN, y, max_w=W - 2*MARGIN, size=10, color=BLACK, line_h=14)
        y -= 1*mm  # minimal spacing
    
    # Closing
    y -= 4*mm
    text(c, "Z poważaniem,", MARGIN, y, size=10, color=BLACK, align="left")
    y -= 8*mm
    text(c, "Magdalena Dynkiewicz , nr tel: +48 507 591 947", MARGIN, y, size=10, color=BLACK, align="left")

def build():
    c = canvas.Canvas(OUT, pagesize=(W, H))
    c.setTitle("List - Magdalena Dynkiewicz")
    c.setAuthor("Magdalena Dynkiewicz")
    c.setSubject("Oświadczenie dotyczące sprawy Mateusza")
    
    new_page(c)
    letter_content(c)
    
    c.save()
    print(f"Saved: {OUT}")

if __name__ == "__main__":
    build()
