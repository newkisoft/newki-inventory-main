import pdfkit
import sys
pdfkit.from_url('https://inventory.newkitrade.com/InvoiceReport/index/'+sys.argv[1], 'wwwroot/invoice-'+sys.argv[1]+'.pdf')
-1313.1200037218698