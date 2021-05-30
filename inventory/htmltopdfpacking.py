import pdfkit
import sys
pdfkit.from_url('http://localhost:4001/PackingList/index/'+sys.argv[1], 'wwwroot/packing-'+sys.argv[1]+'.pdf')
