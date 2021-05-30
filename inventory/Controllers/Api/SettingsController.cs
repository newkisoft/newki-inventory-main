using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using inventory.Services;
using System.Text.Json;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Settings.RoleName)]
    [Route("api/Settings")]
    public class SettingsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SettingsController(ApplicationDbContext context,
                                IRabbitMqService rabbitMqService)
        {
            _context = context;

        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            List<Setting> Items = await _context.Setting
            .OrderByDescending(p => p.Id).ToListAsync();
            return Ok(Items);
        }

        [HttpGet("GetKey/{id}")]
        public IActionResult GetKey(string id)
        {

            var setting = _context.Setting.FirstOrDefault(p => p.Key == id);
            return Ok(setting);
        }

        [HttpGet("GetSetting/{id}")]
        public IActionResult GetSetting(int id)
        {
            return Ok(_context.Setting.FirstOrDefault(p => p.Id == id));
        }

        [HttpPost("[action]")]
        public IActionResult Insert([FromBody] Setting setting)
        {
            _context.Setting.Add(setting);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("UpdateAsync")]
        public IActionResult UpdateAsync([FromBody] Setting setting)
        {            
            var existingSetting = _context.Setting.Find(setting.Id);
            _context.Entry(existingSetting).CurrentValues.SetValues(setting);
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("Remove/{id}")]
        public IActionResult Remove(int id)
        {
            var setting = _context.Setting.FirstOrDefault(p=>p.Id == id);
            _context.Setting.Remove(setting);
            _context.SaveChanges();
            return Ok();
        }
    }
}