 # 02000-XML.py
# # -*- coding: utf-8 -*-
""""
Procesamiento genérico de archivos XML

@version 1.1 16/Mayo/2020
@author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
"""

import xml.etree.ElementTree as ET

def generarNuevoKML(ruta, number):
    escala = 20
    if(number == 2):
        escala = 5
    fileName = "xml/perfil{0}.svg".format(number)
    header = '<?xml version="1.0" encoding="UTF-8" ?>\n<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n<polyline points=\n"'
    afterCords = '"\nstyle="fill:white;stroke:red;stroke-width:4" />\n'
    marks = '<text x="{0}" y="{1}" style="writing-mode: tb; glyph-orientation-vertical: 0;">\n{2}\n</text>'
    finsih = '</svg>'
    file = open(fileName, 'w', encoding="utf-8")
    file.write(header)
    
    firstPoint = "10,200\n"
    file.write(firstPoint)
    splittedFirst = firstPoint.split(",")  
    lastX = 10
    for hito in ruta.findall('.//{http://www.uniovi.es/rutas}hito'):
        lastX = lastX + float(hito.find("{http://www.uniovi.es/rutas}distanciaHitoAnterior").find("{http://www.uniovi.es/rutas}cantidad").text)
        lastY = (float(hito.find("{http://www.uniovi.es/rutas}coordenadas").get("altitud")) + 1)
        file.write("{0},{1}\n".format(lastX * escala + 60, float(splittedFirst[1]) - lastY))

    file.write("{0},{1}".format(lastX*escala + float(splittedFirst[0]) + 100, splittedFirst[1]))
    file.write(firstPoint)
    file.write(afterCords)
   

    file.write(marks.format(splittedFirst[0], float(splittedFirst[1]) + 10, "Inicio"))

    lastX = 10
    for hito in ruta.findall('.//{http://www.uniovi.es/rutas}hito'):
        lastX = lastX + float(hito.find("{http://www.uniovi.es/rutas}distanciaHitoAnterior").find("{http://www.uniovi.es/rutas}cantidad").text) 
        file.write(marks.format(lastX * escala + 60, float(splittedFirst[1]) + 10, hito.find("{http://www.uniovi.es/rutas}nombre").text))
    
    file.write(marks.format(lastX*escala + float(splittedFirst[0]) + 100, float(splittedFirst[1]) + 10, "Final"))
    file.write(finsih) 

def verXML(archivoXML):
    """Función verXML(archivoXML)
Visualiza por pantalla un archivo XML mostrando:
    - El elemento raiz con su contenido y sus atributos
    - Todos los elementos con su contenido y los valores de sus atributos
    
Version: 1.1 16/Mayo/2020
Author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
    """
    try:
        
        arbol = ET.parse(archivoXML)
        
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()
       
    raiz = arbol.getroot()

    number = 1
    # Recorrido de los elementos del árbol
    for hijo in raiz.findall('.//{http://www.uniovi.es/rutas}ruta'): # Expresión Path
        generarNuevoKML(hijo, number)
        number += 1
def main():
    verXML("xml/rutasEsquema.xml")

if __name__ == "__main__":
    main()  