using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using inventory.Services;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using Amazon;
using Amazon.Runtime.CredentialManagement;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Leave.RoleName)]
    [Route("api/Leave")]
    public class LeaveController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string bucketName = "newki";        
        private static readonly RegionEndpoint bucketRegion = RegionEndpoint.USEast1;

        public LeaveController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetLeaves()
        {
            var Items = await _context.Leave
            .Include(p=>p.Vendor).OrderByDescending(p=>p.LeaveStartDate).ToListAsync();
            int Count = Items.Count();
            return Ok(new { Items, Count });
        }

        [HttpGet("GetLeave/{id}")]
        public  IActionResult GetLeave(int id)
        {
            var Item =  _context.Leave.Include(p=>p.Vendor)
            .FirstOrDefault(p=>p.LeaveId == id);            
            return Ok(Item);
        }


        [HttpPost("[action]")]
        public IActionResult Insert([FromBody]Leave leave)
        {   
            leave.Vendor = _context.Vendor.FirstOrDefault(p=>p.VendorId == leave.Vendor.VendorId);     
            _context.Leave.Add(leave);            
            _context.SaveChanges();
            return Ok(leave);
        }
        
    
        [HttpPost("[action]")]
        public IActionResult Update([FromBody]Leave leave)
        {   
            var newVendor = _context.Vendor
            .FirstOrDefault(p=>p.VendorId == leave.Vendor.VendorId);
            var oldLeave =_context.Leave                                    
                                    .Include(p=>p.Vendor)
                                    .FirstOrDefault(p=>p.LeaveId == leave.LeaveId);                                    


            oldLeave.Vendor = newVendor;
            oldLeave.Description = leave.Description;
            oldLeave.LeaveStartDate = leave.LeaveStartDate;
            oldLeave.LeaveEndDate = leave.LeaveEndDate;
                        
            _context.Leave.Update(oldLeave);
            
            _context.SaveChanges();
            return Ok(leave);
        }

        [HttpDelete("[action]")]
        public IActionResult Delete(int leaveId)
        {
            var leaveOld = _context.Leave
                .Include(p=>p.Vendor)
                .Where(x => x.LeaveId == leaveId)
                .FirstOrDefault();            

            _context.Leave.Remove(leaveOld);
            _context.SaveChanges();
            return Ok(leaveOld);

        }

        
    }
}