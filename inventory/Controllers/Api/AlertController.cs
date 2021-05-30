using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;
using System;
using System.Text.Json;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Bill.RoleName)]
    [Route("api/Alert")]
    public class AlertController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AlertController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetTekstilkent")]
        public IActionResult GetTekstilkent()
        {
            var alerts = _context.AlertDataView
                        .Where(p => p.AlertType == AlertTypes.Tekstilkent.ToString())
                        .Select(p => p.Id);

            return Ok(alerts);
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var alerts = _context.AlertDataView
                            .Where(p => p.AlertType == AlertTypes.All.ToString())
                            .Select(p => p.Id);

            return Ok(alerts);
        }
    }
}