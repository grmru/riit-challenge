using System.Collections.Generic;
using System.Threading.Tasks;

namespace TestApp.Data
{
    public interface IItemsRepository
    {
        Task<IEnumerable<Item>> GetAll();
        Task<Item> GetById(string itemNumber);
        Task Add(Item item);
        Task Update(Item item);
        Task Delete(string itemNumber);
    }
}