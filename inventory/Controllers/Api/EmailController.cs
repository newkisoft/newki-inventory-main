using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using Microsoft.AspNetCore.Authorization;
using inventory.Services;
using System;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Invoice.RoleName)]
    [Route("api/Email")]
    public class EmailController : Controller
    {
          private readonly ApplicationDbContext _context;
          private IEmailSender _emailSender;

        public EmailController(ApplicationDbContext context,IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        [HttpGet]
        public async Task<IActionResult> Send(int invoiceId)
        {
            var invoice = _context.Invoice.Include(p=>p.Customer)
            .Include(p=>p.InvoicePallets).ThenInclude(w=>w.Pallet)
            .Include(p=>p.InvoiceBoxes).ThenInclude(w=>w.Box)
            .FirstOrDefault(p=>p.InvoiceId == invoiceId);
            var driverName = invoice.DriverName;
            var carRegisterationNumber = invoice.DriverRegistrationNumber;

            var title = $"Exit permit for {invoice.Customer.CustomerName}";
            var body = $"<strong>Tarih<strong/>:{invoice.InvoiceDate} <br/>Merhabalar<br/><br/> Sayın asbir antrepo sorumlusu<br/>";            
            body = $"{body}Lütfen aşağıda listelenen ürünleri araba pilaka numarasi <br/>";
            body = $"{body}sürücü adı: {driverName}<br/>Araç kayıt numarası:{carRegisterationNumber}<br/>";
            body = $"<br/>{body}<br/><table border='1'><tr><th> S </th> <th>  Renk Kodu  </th> <th>  Agirlik ( kg ) </th><th>  Seryal NO  </th></tr>";
            double totalWeight =0;
            var rows = "";
            foreach(var invoicePallet in invoice.InvoicePallets){
                rows = $"{rows} <tr><td>{invoicePallet.Pallet.PalletNumber}  </td>  <td> {invoicePallet.Pallet.ColorCode}    </td> <td>  {invoicePallet.Pallet.Weight}    </td> <td>   {invoicePallet.Pallet.Barcode} </td> </tr>";
                totalWeight += invoicePallet.Pallet.Weight;
            }
            foreach(var invoiceBox in invoice.InvoiceBoxes){
                rows = $"{rows} <tr><td>{invoiceBox.Box.Denier}/ {invoiceBox.Box.Filament}  </td>  <td> {invoiceBox.Box.ColorCode}    </td> <td>  {invoiceBox.Box.Weight}    </td> <td>   {invoiceBox.Box.Barcode} </td> </tr>";
                totalWeight += invoiceBox.Box.Weight;
            }

            body = $"{body} {rows} </table><br/>";
            body = $"{body} Toplam :{totalWeight}";
            await _emailSender.SendAsync(title, body);
            return Ok();
        }
    }
}