import pdfkit
import sys
pdfkit.from_url('https://inventory.newkitrade.com/ProformaReport/index/'+sys.argv[1], 'wwwroot/proforma-'+sys.argv[1]+'.pdf')
