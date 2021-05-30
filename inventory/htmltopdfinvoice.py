import pdfkit
import sys
pdfkit.from_url('http://localhost:4001/InvoiceReport/index/'+sys.argv[1], 'wwwroot/invoice-'+sys.argv[1]+'.pdf')
