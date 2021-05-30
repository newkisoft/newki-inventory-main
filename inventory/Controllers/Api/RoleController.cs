using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using inventory.Data;
using inventory.Models;
using inventory.Models.AccountViewModels;
using inventory.Models.SyncfusionViewModels;
using inventory.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Roles.RoleName)]
    [Route("api/Role")]
    public class RoleController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRoles _roles;

        public RoleController(ApplicationDbContext context,
                        UserManager<ApplicationUser> userManager,
                        RoleManager<IdentityRole> roleManager,
                        IRoles roles)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _roles = roles;
        }

        // GET: api/Role
        [HttpGet]
        public async Task<IActionResult> GetRole()
        {
            await _roles.GenerateRolesFromPagesAsync();

            List<IdentityRole> Items = new List<IdentityRole>();
            Items = _roleManager.Roles.ToList();
            int Count = Items.Count();
            return Ok(new { Items, Count });
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetRole(string id)
        {
            await _roles.GenerateRolesFromPagesAsync();

            List<IdentityRole> Items = new List<IdentityRole>();
            Items = _roleManager.Roles.Where(p=>p.Id == id).ToList();
            int Count = Items.Count();
            return Ok(new { Items, Count });
        }

        // GET: api/Role
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetRoleByApplicationUserId([FromRoute] string id)
        {
            await _roles.GenerateRolesFromPagesAsync();
            var user = await _userManager.FindByIdAsync(id);
            var roles = _roleManager.Roles.ToList();
            List<UserRoleViewModel> Items = new List<UserRoleViewModel>();
            int count = 1;
            foreach (var item in roles)
            {
                bool isInRole = (await _userManager.IsInRoleAsync(user, item.Name)) ? true : false;
                Items.Add(new UserRoleViewModel { CounterId = count, ApplicationUserId = id, RoleName = item.Name, IsHaveAccess = isInRole });
                count++;
            }

            int Count = Items.Count();
            return Ok(new { Items, Count });
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> InsertRole([FromBody] IdentityRole role)
        {
            if (role != null)
            {
                await _roleManager.CreateAsync(role);
            }
            return Ok(role);
        }

        [HttpPut("[action]")]
        public IActionResult UpdateRole([FromBody] IdentityRole role)
        {
            if (role != null)
            {
                var existingRole = _context.Roles.FirstOrDefault(p=>p.Id == role.Id);
                existingRole.Name = role.Name;                 
                _context.SaveChanges();
            }
            return Ok(role);
        }

          [HttpDelete("[action]")]
        public IActionResult DeleteRole( string roleId)
        {
            _context.Roles.Remove(_context.Roles.FirstOrDefault(p=>p.Id == roleId));
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateUserRole([FromBody] List<UserRoleViewModel> userRoles)
        {
            foreach (var userRole in userRoles)
            {
                if (userRole != null)
                {
                    var user = await _userManager.FindByIdAsync(userRole.ApplicationUserId);
                    if (user != null)
                    {
                        if (userRole.IsHaveAccess)
                        {
                            await _userManager.AddToRoleAsync(user, userRole.RoleName);
                        }
                        else
                        {
                            await _userManager.RemoveFromRoleAsync(user, userRole.RoleName);
                        }
                    }
                }
            }
            return Ok(userRoles);
        }
    }
}