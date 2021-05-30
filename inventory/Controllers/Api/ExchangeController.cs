using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Xml;
using System.Net.Http;
using inventory.Models;
using System.Text.Json;
using System;
using System.Collections.Generic;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/Exchange")]
    public class ExchangeController : Controller
    {
           // GET: api/Invoice
        [HttpGet]
        public IActionResult Get()
        {
            var d = DateTime.Now.ToString();
            var rate = 5.7;
            var URLString = "https://www.tcmb.gov.tr/kurlar/today.xml";
            var reader = new XmlTextReader (URLString);
            var cnt = 0;
            
            while (reader.Read()) 
            {
                switch (reader.NodeType) 
                {
                    case XmlNodeType.Element: 
                        break;

                    case XmlNodeType.Text:                         
                        if(cnt==4)
                            double.TryParse(reader.Value,out rate);

                        cnt++;
                        break;

                    case XmlNodeType. EndElement: //Display the end of the element.
                        break;
                }
            }
            return Ok(rate);
        }

        [HttpGet("Get/{date}/{from}/{to}")]
        public async Task<IActionResult> Get(DateTime date,string from,string to)
        {
            var client = new HttpClient();
            var rate = "0";
            var stringDate = date.Year>2000? date.ToString("yyyy-MM-dd"):"latest";            
            var urlString = $"https://www.currency.me.uk/remote/ER-CCPAIR-AJAX.php?ConvertTo={to.ToUpper()}&ConvertFrom={from.ToUpper()}&amount=1";

            var response =  await client.GetStringAsync(new Uri(urlString));

            //rate = response.Split(',')[1].Split(':')[2].Replace("}","");

            return Ok(double.Parse(response));            
        }

    }
}