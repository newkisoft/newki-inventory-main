using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory.Data;
using inventory.Models;
using Microsoft.AspNetCore.Authorization;
using newkilibraries;

namespace inventory.Controllers.Api
{
    [Authorize]
    [Produces("application/json")]
    [Authorize(Roles = Pages.MainMenu.Agent.RoleName)]
    [Route("api/Agent")]
    public class AgentController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AgentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Agents
        [HttpGet]
        public async Task<IActionResult> GetAgents()
        {
            List<Agent> Items = await _context.Agent.OrderByDescending(p=>p.AgentId).ToListAsync();
            int Count = Items.Count();
            return Ok(new { Items, Count });
        }

        [HttpGet("GetAgent/{id}")]
        public IActionResult GetAgent(int id)
        {  
            var agent = _context.Agent.Include(p=>p.Customers).ThenInclude(w=>w.Customer).FirstOrDefault(p=>p.AgentId == id);                
            return Ok(agent);           
        } 

        [HttpGet("GetAgentsSalary/{id}")]
        public IActionResult GetAgentsSalary(int id)
        {  
            var agent = _context.Agent.Include(p=>p.Customers).ThenInclude(w=>w.Customer).FirstOrDefault(p=>p.AgentId == id);                
            var agentSalaries = new List<AgentSalary>();
            foreach(var customer in agent.Customers){
                var invoices = _context.Invoice
                    .Include(p=>p.InvoicePallets)
                    .Include(p=>p.InvoiceBoxes)
                    .Where(p=>p.Customer.CustomerId == customer.CustomerId );
                foreach(var invoice in invoices){
                    var weight = 0.0;
                    var agentSalary = new AgentSalary();
                    foreach(var pallet in  invoice.InvoicePallets){
                      weight += pallet.Weight;
                    }            
                    foreach(var box in  invoice.InvoiceBoxes){
                      weight += box.Weight;
                    }            
                    agentSalary.Salary = weight * customer.Rate;
                    agentSalary.Date = invoice.InvoiceDate;
                    agentSalaries.Add(agentSalary);
                }
            }
            return Ok(agentSalaries.OrderByDescending(p=>p.Date));           
        } 


        [HttpPost("[action]")]
        public IActionResult Insert([FromBody]Agent agent)
        {            
            _context.Agent.Add(agent);
            _context.SaveChanges();
            return Ok(agent);
        }

        [HttpPut("[action]")]
        public IActionResult Update([FromBody]Agent agent)
        {            
            _context.Agent.Update(agent);
            _context.SaveChanges();
            return Ok(agent);
        }

        [HttpDelete("Remove/{id}")]
        public IActionResult Remove(int id)
        {            
            var agent = _context.Agent
                .Where(x => x.AgentId == id)
                .FirstOrDefault();
            _context.Agent.Remove(agent);
            _context.SaveChanges();
            return Ok(agent);            
        }
    }
}