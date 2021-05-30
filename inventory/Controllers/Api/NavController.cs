using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;
using Microsoft.AspNetCore.Identity;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]    
    [Route("api/nav")]
    public class NavController : Controller
    {
        private readonly ApplicationDbContext _context;

        public NavController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {           
            var links = new List<string>();
            var roles = _context.Roles.ToList();
            var user = _context.Users.FirstOrDefault(p=>p.Email == User.Identity.Name);
            var userRoles = _context.UserRoles.Where(p=>p.UserId == user.Id);            
            
            if(user == null)
                return Ok(links);

            foreach(var role in userRoles)
            {
                var roleName = roles.FirstOrDefault(p=>p.Id == role.RoleId);
                links.Add(roleName.Name);
            }

            return Ok(links.OrderBy(p=>p));
        }
    }
}