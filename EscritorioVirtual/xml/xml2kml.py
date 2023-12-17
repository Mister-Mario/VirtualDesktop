 # 02000-XML.py
# # -*- coding: utf-8 -*-
""""
Procesamiento genérico de archivos XML

@version 1.1 16/Mayo/2020
@author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
"""

import xml.etree.ElementTree as ET

def generarNuevoKML(ruta, number):
    fileName = "xml/ruta{0}.kml".format(number)
    header = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n'
    docStart = "<Document id='Universidad de Oviedo'>\n<Placemark>\n<name>{0}</name>\n<description>{1}</description>\n<LineString>\n<extrude>1</extrude>\n<tessellate>1</tessellate>\n<coordinates>\n".format(ruta.findall('{http://www.uniovi.es/rutas}nombre')[0].text,
                                                                                                                                                                                                                ruta.findall('{http://www.uniovi.es/rutas}descripcion')[0].text)
    footer = "</coordinates>\n<altitudeMode>relativeToGround</altitudeMode>\n</LineString>\n<Style id='redLine'>\n<LineStyle>\n<color>#ff0000ff</color>\n<width>5</width>\n</LineStyle>\n</Style>\n</Placemark>\n</Document>\n</kml>\n"
    file = open(fileName, 'w', encoding="utf-8")
    file.write(header)
    file.write(docStart)
    for coordinates in ruta.findall('{http://www.uniovi.es/rutas}coordenadas'):
        file.write("{0},{1},{2}\n".format(coordinates.get("latitud"), coordinates.get("longitud"), coordinates.get("altitud")))
    for coordinates in ruta.findall('.//{http://www.uniovi.es/rutas}hito/{http://www.uniovi.es/rutas}coordenadas'):
        file.write("{0},{1},{2}\n".format(coordinates.get("latitud"), coordinates.get("longitud"), coordinates.get("altitud")))
    file.write(footer) 

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
    
    print("\nElemento raiz = ", raiz.tag)

    number = 1
    # Recorrido de los elementos del árbol
    for hijo in raiz.findall('.//{http://www.uniovi.es/rutas}ruta'): # Expresión Path
        generarNuevoKML(hijo, number)
        number += 1
def main():
    verXML("xml/rutasEsquema.xml")

if __name__ == "__main__":
    main()  