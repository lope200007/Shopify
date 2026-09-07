import re, subprocess, time, sys, html as H
BASE="https://patitascalidas.com"
TIENDA="Patitascalidas"   # nombre que el tema anade al final de cada titulo
PRODUCTOS="""pack-bano-y-lluvia alfombrilla-de-lamer-con-ventosas manopla-de-bano-y-secado
albornoz-de-secado-para-perro toalla-de-secado-rapido-para-perro manta-impermeable-para-sofa-y-cama
funda-de-asiento-coche-para-perro comedero-lento-y-alfombrilla-de-lamer boton-grabable-para-perros
funda-collar-airtag-perro peluche-con-chirriador-para-perro chubasquero-para-perro
chaleco-antiestres-para-perro cinturon-seguridad-coche-perro bozal-de-nailon-para-perro
conjunto-arnes-correa-reflectante botella-paseo-3-en-1 cepillo-autolimpiable-pulverizador
guante-quitapelo-silicona dispensador-gravedad-pienso-agua lima-electrica-unas-perro
cortapelo-patas-perro cubremaletero-perro-coche comedero-puzzle-tres-capas
tentetieso-dispensador-premios parque-plegable-perro barrera-seguridad-perro
escalera-plegable-perro dinosaurio-peluche-perro
pack-aseo-en-casa-lima-de-unas-cortapelo-y-guante
pack-comer-despacio-comedero-puzzle-alfombrilla-y-tentetieso
pack-cachorro-recien-llegado-parque-barrera-y-peluche
limpiapatas-electrico-perro lanzapelotas-muelle-dispensador
cama-sofa-perro-funda-desmontable""".split()
CON_BLOQUE={"lima-electrica-unas-perro","cortapelo-patas-perro","guante-quitapelo-silicona",
 "comedero-puzzle-tres-capas","alfombrilla-de-lamer-con-ventosas","tentetieso-dispensador-premios",
 "parque-plegable-perro","barrera-seguridad-perro","dinosaurio-peluche-perro",
 "albornoz-de-secado-para-perro","toalla-de-secado-rapido-para-perro","manopla-de-bano-y-secado"}
PACKS={"pack-aseo-en-casa-lima-de-unas-cortapelo-y-guante","pack-bano-y-lluvia",
 "pack-comer-despacio-comedero-puzzle-alfombrilla-y-tentetieso",
 "pack-cachorro-recien-llegado-parque-barrera-y-peluche"}
COLS=["packs","comederos","juguetes","higiene-y-cuidado","casa-y-coche","lluvia-y-barro","camas-y-descanso"]

def bajar(url):
    for i in range(6):
        p=subprocess.run(["curl","-s","-w","\\n%{http_code}",url],capture_output=True,text=True)
        t=p.stdout; c=t.rfind("\n"); cuerpo,cod=t[:c],t[c+1:].strip()
        if cod=="200" and "Verifying your connection" not in cuerpo and len(cuerpo)>5000: return cod,cuerpo
        time.sleep(4+i*3)
    return cod,cuerpo
def meta(h,p):
    m=re.search(p,h,re.S)
    return H.unescape(re.sub(r"\s+"," ",m.group(1)).strip()) if m else None

fallos=[];avisos=[]
def revisar(ruta,etq,bloque=False,minimg=None):
    cod,h=bajar(BASE+ruta)
    if cod!="200": fallos.append(f"{etq}: HTTP {cod}"); return
    t=meta(h,r"<title>(.*?)</title>"); d=meta(h,r'<meta\s+name="description"\s+content="(.*?)"\s*>')
    oi=meta(h,r'<meta\s+property="og:image"\s+content="(.*?)"\s*>')
    # El tema anade " - <nombre de la tienda>" a todo titulo que no lo lleve ya.
    # Con un nombre de 14 letras eso son 17 caracteres que no se pueden recortar
    # sin quitarle palabras utiles al titulo. Distinguimos las dos cosas:
    #   fallo  -> el titulo propio de la pagina ya se pasa de 60
    #   aviso  -> solo se pasa por el sufijo del nombre de la tienda
    if not t:
        fallos.append(f"{etq}: sin <title>")
    else:
        propio = re.sub(r"\s*[\u2013-]\s*" + re.escape(TIENDA) + r"\s*$", "", t)
        if len(propio) > 60:
            fallos.append(f"{etq}: title propio de {len(propio)} car. -> {propio}")
        elif len(t) > 60:
            avisos.append(f"{etq}: {len(t)} car. con el nombre detras ({len(propio)} sin el)")
    if not d: fallos.append(f"{etq}: sin meta description")
    elif len(d)>155: fallos.append(f"{etq}: meta de {len(d)} car.")
    if not oi: fallos.append(f"{etq}: sin og:image")
    if bloque and "También en pack" not in h: fallos.append(f"{etq}: falta bloque 'También en pack'")
    if minimg:
        n=len(set(re.findall(r"/cdn/shop/files/[^\s\"'?&\\]+\.(?:jpg|png|webp)",h)))
        if n<minimg: fallos.append(f"{etq}: solo {n} imagenes")
    return t

for i,x in enumerate(PRODUCTOS,1):
    t=revisar(f"/products/{x}",x,x in CON_BLOQUE,4 if x in PACKS else None)
    print(f"  [{i:>2}/{len(PRODUCTOS)}] {(t or '')[:62]}"); sys.stdout.flush(); time.sleep(1.5)
for c in COLS:
    t=revisar(f"/collections/{c}",f"col/{c}"); print(f"  col {c}: {(t or '')[:62]}"); time.sleep(1.5)
cod,h=bajar(BASE+"/")
t=meta(h,r"<title>(.*?)</title>")
if not meta(h,r'<meta\s+property="og:image"\s+content="(.*?)"\s*>'):
    avisos.append("portada: sin og:image (ajuste del tema, lo tienes que poner tu)")
print(f"  portada: {t}")
print("\n"+"="*58)
print(f"FALLOS: {len(fallos)}")
for f in fallos: print("  X "+f)
print(f"PENDIENTE DE TI: {len(avisos)}")
for a in avisos: print("  ! "+a)
