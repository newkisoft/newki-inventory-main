using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using inventory.Data;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using System.Linq;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Pallet.RoleName)]
    [Route("api/Filter")]
    public class FilterController : Controller
    {
        private readonly ApplicationDbContext _context;


        public FilterController(ApplicationDbContext context)
        {
            _context = context;

        }


        [HttpGet]
        public IActionResult Get()
        {
            var filters = new List<string>();
            foreach (var filter in _context.PalletFilter.OrderBy(p=>p.ColumnName))
            {
                var values = JsonSerializer.Deserialize<List<JsonElement>>(filter.Keywords);
                foreach(var value in values)
                {
                    var combinedFilter = value.ValueKind == JsonValueKind.String?$"\"{filter.ColumnName}\":\"{value}\"":$"\"{filter.ColumnName}\":{value.ToString().ToLower()}";
                    filters.Add(combinedFilter);
                }
            }

            return Ok(filters);

        }

        [HttpGet("box")]
        public IActionResult Box()
        {
            var filters = new List<string>();
           foreach (var filter in _context.BoxFilter.OrderBy(p=>p.ColumnName))
            {
                var values = JsonSerializer.Deserialize<List<JsonElement>>(filter.Keywords);
                foreach(var value in values)
                {
                    var combinedFilter = value.ValueKind == JsonValueKind.String?$"\"{filter.ColumnName}\":\"{value}\"":$"\"{filter.ColumnName}\":{value.ToString().ToLower()}";
                    filters.Add(combinedFilter);
                }
            }
            return Ok(filters);

        }

    }
}