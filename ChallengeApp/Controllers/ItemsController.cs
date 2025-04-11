using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestApp.Data;

namespace TestApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IItemsRepository _repository;

        public ItemsController(IItemsRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetAll()
        {
            return Ok(await _repository.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> Get(string id)
        {
            var item = await _repository.GetById(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpGet("valid/{id}")]
        public async Task<ActionResult<bool>> GetValid(string id)
        {
            var result = await _repository.ValidateItemNumber(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Item>> Post(Item item)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _repository.Add(item);
            return CreatedAtAction(nameof(Get), new { id = item.ItemNumber }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, Item item)
        {
            //if (id != item.ItemNumber)
            //    return BadRequest();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingItem = await _repository.GetById(id);
            if (existingItem == null)
                return NotFound();

            item.ItemNumber = id;
            await _repository.Update(item);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _repository.GetById(id);
            if (item == null)
                return NotFound();

            await _repository.Delete(id);
            return NoContent();
        }
    }
}