import pdfkit
import sys
pdfkit.from_url('http://localhost:4001/ProformaReport/index/'+sys.argv[1], 'wwwroot/proforma-'+sys.argv[1]+'.pdf')
