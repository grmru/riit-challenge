using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestApp.Data;

namespace TestApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemTypesController : ControllerBase
    {
        private readonly IItemTypesRepository _repository;

        public ItemTypesController(IItemTypesRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemType>>> GetAll()
        {
            return Ok(await _repository.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ItemType>> Get(int id)
        {
            var item = await _repository.GetById(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ItemType>> Post(ItemType item)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _repository.Add(item);
            return CreatedAtAction(nameof(Get), new { id = item.ItemTypeId }, item);
        }
    }
}