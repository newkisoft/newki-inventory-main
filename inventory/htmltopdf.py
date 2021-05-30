import pdfkit
import sys
url = 'http://localhost:4001/WarehouseTakeOutReport/index/?name='+sys.argv[1]+'&color='+sys.argv[2]+'&colorcode='+sys.argv[3]+'&denier='+sys.argv[4]+'&yarntype='+sys.argv[5]+'&palletbarcode='+sys.argv[6]+'&palletweight='+sys.argv[7]+'&date='+sys.argv[9]+'&boxes='+sys.argv[10]
pdfkit.from_url(url, 'wwwroot/report-'+sys.argv[8]+'.pdf')
