import pdfkit
import sys
pdfkit.from_url('http://localhost:4001/CommercialInvoiceReport/index/'+sys.argv[1], 'wwwroot/commercial-'+sys.argv[1]+'.pdf')
