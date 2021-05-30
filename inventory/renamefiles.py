import uuid
import re
import os  
import glob
import sys

indexPath = sys.argv[1]
wwwrootPath = sys.argv[2]


jsPath = wwwrootPath + "*.js"
cssPath = wwwrootPath + "*.css"
files = glob.glob(jsPath)
cssFiles = glob.glob(cssPath)
jsContentLinks = ""
cssContentLink = ""

files.sort(reverse=True)
for jsFile in files:
    filename = jsFile.replace(wwwrootPath,"")
    jsType = ""
    if "2015" in filename:
        jsType = " type=\"module\"></script>"
    else:
        jsType = " nomodule></script>"
    jsContentLinks = jsContentLinks + "<script src=\""+filename+"\" "+jsType

for cssFile in cssFiles:
    cssFilename = cssFile.replace(wwwrootPath,"")
    cssContentLink = cssContentLink + "<link rel=\"stylesheet\" href=\""+cssFilename+"\" >"


f = open(indexPath, "r")
content = f.read()
f.close()

f = open(indexPath, "w")
content = re.sub(r"<link.*>", "", content)
content = re.sub(r"<script.*/script>", "", content)
content = content + jsContentLinks
content = content + cssContentLink
f.write(content)

